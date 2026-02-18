import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ConsultaRequest {
  client_id: string;
  tipo: "federal" | "fgts" | "estadual";
}

const API_ENDPOINTS: Record<string, string> = {
  federal: "https://api.infosimples.com/api/v2/consultas/receita-federal/pgfn/nova",
  fgts: "https://api.infosimples.com/api/v2/consultas/caixa/regularidade",
  estadual: "https://api.infosimples.com/api/v2/consultas/sefaz/pr/certidao-debitos",
};

const ORGAO_MAP: Record<string, string> = {
  federal: "receita_federal",
  fgts: "caixa",
  estadual: "sefaz",
};

async function uploadPdfToStorage(
  supabaseService: ReturnType<typeof createClient>,
  pdfBase64: string,
  clientId: string,
  tipo: string,
  cnpj: string
): Promise<{ url: string; nome: string } | null> {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${cleanCnpj}/${tipo}/CND_${tipo}_${timestamp}.pdf`;

    const binaryString = atob(pdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { error: uploadError } = await supabaseService.storage
      .from("cnd-documentos")
      .upload(fileName, bytes.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return null;
    }

    const { data: publicUrl } = supabaseService.storage
      .from("cnd-documentos")
      .getPublicUrl(fileName);

    return {
      url: publicUrl.publicUrl,
      nome: `CND_${tipo}_${cleanCnpj}_${timestamp}.pdf`,
    };
  } catch (error: any) {
    console.error("PDF upload error:", error.message);
    return null;
  }
}

async function downloadAndUploadSiteReceipt(
  supabaseService: ReturnType<typeof createClient>,
  siteReceiptUrl: string,
  clientId: string,
  tipo: string,
  cnpj: string
): Promise<{ url: string; nome: string } | null> {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const response = await fetch(siteReceiptUrl);
    if (!response.ok) {
      console.error("Failed to download site_receipt:", response.status);
      return null;
    }

    // Detect if the file is a PDF based on URL extension or content-type header
    const contentType = response.headers.get("content-type") || "";
    const isPdf = siteReceiptUrl.toLowerCase().endsWith(".pdf") || contentType.includes("application/pdf");
    const ext = isPdf ? "pdf" : "html";
    const mimeType = isPdf ? "application/pdf" : "text/html";

    const fileName = `${cleanCnpj}/${tipo}/CND_${tipo}_${timestamp}.${ext}`;
    const fileContent = await response.arrayBuffer();

    const { error: uploadError } = await supabaseService.storage
      .from("cnd-documentos")
      .upload(fileName, fileContent, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return null;
    }

    const { data: publicUrl } = supabaseService.storage
      .from("cnd-documentos")
      .getPublicUrl(fileName);

    return {
      url: publicUrl.publicUrl,
      nome: `CND_${tipo}_${cleanCnpj}_${timestamp}.${ext}`,
    };
  } catch (error: any) {
    console.error("Site receipt download/upload error:", error.message);
    return null;
  }
}

async function processConsulta(
  jobId: string,
  clientId: string,
  tipo: "federal" | "fgts" | "estadual",
  cnpj: string,
  userId: string,
  supabaseService: ReturnType<typeof createClient>,
  infosimplesToken: string
) {
  const startTime = Date.now();

  try {
    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ progress: 10 })
      .eq("id", jobId);

    const endpoint = API_ENDPOINTS[tipo];
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");

    const requestBody: Record<string, unknown> = {
      token: infosimplesToken,
      cnpj: cleanCnpj,
      timeout: 300,
    };

    if (tipo === "fgts") {
      requestBody.tipo = "empregador";
    }

    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ progress: 25 })
      .eq("id", jobId);

    const apiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const apiData = await apiResponse.json();
    console.log("API Response code:", apiData.code);

    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ progress: 50 })
      .eq("id", jobId);

    let status = "pendente";
    let dataValidade: string | null = null;
    let dataEmissao: string | null = null;
    let numeroCertidao: string | null = null;
    let codigoControle: string | null = null;
    let situacao: string | null = null;
    let pdfBase64: string | null = null;
    let siteReceiptUrl: string | null = null;
    const creditosUsados = apiData.credits_used || 0;
    const queryId = apiData.query_id;

    const parseDate = (dateStr: string | undefined): string | null => {
      if (!dateStr) return null;
      const parts = dateStr.split("/");
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return dateStr;
    };

    if (apiData.code === 200 && apiData.data_count > 0) {
      const data = apiData.data[0];

      if (tipo === "federal") {
        situacao = data.situacao || data.certidao?.situacao;
        numeroCertidao = data.numero || data.certidao?.numero;
        codigoControle = data.codigo_controle || data.certidao?.codigo_controle;
        pdfBase64 = data.pdf || data.certidao?.pdf;
        siteReceiptUrl = data.site_receipt || apiData.site_receipts?.[0] || null;
        dataValidade = parseDate(data.data_validade || data.certidao?.data_validade);
        dataEmissao = parseDate(data.data_emissao || data.certidao?.data_emissao);
      } else if (tipo === "fgts") {
        situacao = data.situacao_regularidade || data.situacao;
        numeroCertidao = data.crf || data.numero_crf || data.numero;
        pdfBase64 = data.pdf;
        siteReceiptUrl = data.site_receipt || apiData.site_receipts?.[0] || null;
        dataValidade = parseDate(data.validade_fim_data || data.data_validade);
        dataEmissao = parseDate(data.validade_inicio_data || data.data_emissao);
      } else if (tipo === "estadual") {
        situacao = data.situacao;
        numeroCertidao = data.numero_certidao || data.numero;
        codigoControle = data.codigo_verificacao;
        pdfBase64 = data.pdf;
        siteReceiptUrl = data.site_receipt || apiData.site_receipts?.[0] || null;
        dataValidade = parseDate(data.validade);
      }

      const situacaoLower = situacao?.toLowerCase() || "";
      if (
        situacaoLower.includes("regular") ||
        situacaoLower.includes("negativa") ||
        situacaoLower.includes("nada consta") ||
        situacaoLower.includes("positiva com efeito")
      ) {
        if (dataValidade) {
          const hoje = new Date();
          const validade = new Date(dataValidade);
          const dias = Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          status = dias < 0 ? "vencida" : dias <= 15 ? "vencendo" : "valida";
        } else {
          status = "valida";
        }
      } else if (situacaoLower.includes("pendente") || situacaoLower.includes("pendência")) {
        status = "erro";
      }
    } else if (apiData.code === 600 || apiData.code === 601) {
      situacao = apiData.message || "Consulta em processamento";
    } else {
      status = "erro";
      situacao = apiData.message || "Erro na consulta";
    }

    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ progress: 75 })
      .eq("id", jobId);

    // Upload file to storage: try PDF first, then site_receipt
    let arquivoUrl: string | null = null;
    let arquivoNome: string | null = null;

    if (pdfBase64) {
      const uploadResult = await uploadPdfToStorage(
        supabaseService,
        pdfBase64,
        clientId,
        tipo,
        cnpj
      );
      if (uploadResult) {
        arquivoUrl = uploadResult.url;
        arquivoNome = uploadResult.nome;
        console.log(`PDF uploaded to storage: ${arquivoUrl}`);
      }
    } else if (siteReceiptUrl) {
      console.log(`No PDF base64, downloading site_receipt: ${siteReceiptUrl}`);
      const uploadResult = await downloadAndUploadSiteReceipt(
        supabaseService,
        siteReceiptUrl,
        clientId,
        tipo,
        cnpj
      );
      if (uploadResult) {
        arquivoUrl = uploadResult.url;
        arquivoNome = uploadResult.nome;
        console.log(`Site receipt uploaded to storage: ${arquivoUrl}`);
      }
    }

    const proximoCheck = new Date();
    proximoCheck.setDate(proximoCheck.getDate() + 15);

    const { data: existingCnd } = await supabaseService
      .from("cnd_certidoes")
      .select("id")
      .eq("client_id", clientId)
      .eq("tipo", tipo)
      .maybeSingle();

    const cndData = {
      status,
      situacao,
      numero_certidao: numeroCertidao,
      codigo_controle: codigoControle,
      data_emissao: dataEmissao,
      data_validade: dataValidade,
      arquivo_url: arquivoUrl,
      arquivo_nome: arquivoNome,
      infosimples_query_id: queryId,
      infosimples_status: apiData.code === 200 ? "concluida" : "erro",
      infosimples_creditos_usados: creditosUsados,
      obtida_automaticamente: false,
      proximo_check: proximoCheck.toISOString().split("T")[0],
      api_response: apiData,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existingCnd) {
      const { data, error } = await supabaseService
        .from("cnd_certidoes")
        .update(cndData)
        .eq("id", existingCnd.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseService
        .from("cnd_certidoes")
        .insert({ client_id: clientId, tipo, orgao: ORGAO_MAP[tipo], ...cndData })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    await supabaseService.from("infosimples_creditos").insert({
      tipo_consulta: `cnd_${tipo}`,
      creditos_usados: creditosUsados,
      cnpj_consultado: cleanCnpj,
      custo_estimado: tipo === "federal" ? 1.5 : tipo === "fgts" ? 1.0 : 1.2,
      sucesso: apiData.code === 200,
      query_id: queryId,
      user_id: userId,
    });

    const tempoExecucao = (Date.now() - startTime) / 1000;
    await supabaseService.from("logs_automacao").insert({
      tipo: "cnd",
      client_id: clientId,
      acao: `consulta_cnd_${tipo}`,
      infosimples_query_id: queryId,
      infosimples_creditos: creditosUsados,
      status: apiData.code === 200 ? "sucesso" : "erro",
      mensagem: apiData.code === 200 ? `CND ${tipo} consultada com sucesso` : situacao,
      dados_retorno: apiData,
      tempo_execucao: tempoExecucao,
    });

    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ status: "completed", progress: 100, result: { cnd: result, creditos_usados: creditosUsados } })
      .eq("id", jobId);
  } catch (error: any) {
    console.error("Background processing error:", error.message);
    await supabaseService
      .from("cnd_consultas_jobs")
      .update({ status: "failed", error: error.message })
      .eq("id", jobId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const INFOSIMPLES_TOKEN = Deno.env.get("INFOSIMPLES_TOKEN");
    if (!INFOSIMPLES_TOKEN) {
      throw new Error("INFOSIMPLES_TOKEN não configurado");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Token inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const userId = claimsData.claims.sub as string;
    const { client_id, tipo }: ConsultaRequest = await req.json();

    if (!client_id || !tipo) {
      return new Response(
        JSON.stringify({ success: false, error: "Parâmetros obrigatórios: client_id, tipo" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!API_ENDPOINTS[tipo]) {
      return new Response(
        JSON.stringify({ success: false, error: `Tipo de consulta inválido: ${tipo}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { data: client, error: clientError } = await supabaseAuth
      .from("clients")
      .select("id, user_id, cnpj, company_name, state")
      .eq("id", client_id)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ success: false, error: "Cliente não encontrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    if (client.user_id !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Acesso negado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    console.log(`User ${userId} querying ${tipo} for client ${client_id} (${client.cnpj})`);

    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: job, error: jobError } = await supabaseService
      .from("cnd_consultas_jobs")
      .insert({ client_id, tipo, status: "processing", progress: 0 })
      .select()
      .single();

    if (jobError) throw new Error(`Erro ao criar job: ${jobError.message}`);

    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(
      processConsulta(job.id, client_id, tipo, client.cnpj, userId, supabaseService, INFOSIMPLES_TOKEN)
    );

    return new Response(
      JSON.stringify({ success: true, job_id: job.id, message: "Consulta iniciada. Aguarde o processamento." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 202 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro interno" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
