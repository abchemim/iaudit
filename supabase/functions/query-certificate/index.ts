import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface QueryRequest {
  client_id: string;
  certificate_type: "federal" | "fgts" | "estadual";
  cnpj: string;
}

const API_ENDPOINTS: Record<string, string> = {
  federal: "https://api.infosimples.com/api/v2/consultas/receita-federal/pgfn/nova",
  estadual: "https://api.infosimples.com/api/v2/consultas/sefaz/pr/certidao-debitos",
  fgts: "https://api.infosimples.com/api/v2/consultas/caixa/regularidade",
};

const ORGAO_MAP: Record<string, string> = {
  federal: "receita_federal",
  fgts: "caixa",
  estadual: "sefaz",
};

async function uploadPdfToStorage(
  supabase: ReturnType<typeof createClient>,
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

    const { error: uploadError } = await supabase.storage
      .from("cnd-documentos")
      .upload(fileName, bytes.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage
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
    const { client_id, certificate_type, cnpj }: QueryRequest = await req.json();

    if (!client_id || !certificate_type || !cnpj) {
      return new Response(
        JSON.stringify({ success: false, error: "Parâmetros obrigatórios: client_id, certificate_type, cnpj" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!API_ENDPOINTS[certificate_type]) {
      return new Response(
        JSON.stringify({ success: false, error: `Tipo de certidão inválido: ${certificate_type}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { data: client, error: clientError } = await supabaseAuth
      .from("clients")
      .select("id, user_id, cnpj")
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

    const cleanCnpj = cnpj.replace(/[^\d]/g, "");
    const storedCnpj = client.cnpj.replace(/[^\d]/g, "");
    if (cleanCnpj !== storedCnpj) {
      return new Response(
        JSON.stringify({ success: false, error: "CNPJ não corresponde ao cliente" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`User ${userId} querying ${certificate_type} for client ${client_id}`);

    const apiResponse = await fetch(API_ENDPOINTS[certificate_type], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: INFOSIMPLES_TOKEN, cnpj: cleanCnpj, timeout: 300 }),
    });

    const apiData = await apiResponse.json();
    console.log("API Response code:", apiData.code);

    const parseDate = (dateStr: string | undefined): string | null => {
      if (!dateStr) return null;
      const parts = dateStr.split("/");
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return dateStr;
    };

    let status = "pendente";
    let dataValidade: string | null = null;
    let dataEmissao: string | null = null;
    let numeroCertidao: string | null = null;
    let codigoControle: string | null = null;
    let situacao: string | null = null;
    let pdfBase64: string | null = null;
    const creditosUsados = apiData.credits_used || 0;

    if (apiData.code === 200 && apiData.data_count > 0) {
      const data = apiData.data[0];
      situacao = data.situacao || data.situacao_regularidade;
      numeroCertidao = data.numero || data.numero_certidao || data.numero_crf;
      codigoControle = data.codigo_controle || data.codigo_verificacao;
      pdfBase64 = data.pdf;
      dataValidade = parseDate(data.data_validade || data.validade);
      dataEmissao = parseDate(data.data_emissao);

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

    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Upload PDF to storage if available
    let arquivoUrl: string | null = null;
    let arquivoNome: string | null = null;

    if (pdfBase64) {
      const uploadResult = await uploadPdfToStorage(
        supabaseService,
        pdfBase64,
        client_id,
        certificate_type,
        cnpj
      );
      if (uploadResult) {
        arquivoUrl = uploadResult.url;
        arquivoNome = uploadResult.nome;
        console.log(`PDF uploaded to storage: ${arquivoUrl}`);
      }
    }

    const { data: existingCnd } = await supabaseService
      .from("cnd_certidoes")
      .select("id")
      .eq("client_id", client_id)
      .eq("tipo", certificate_type)
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
      infosimples_status: apiData.code === 200 ? "concluida" : "erro",
      infosimples_creditos_usados: creditosUsados,
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
        .insert({ client_id, tipo: certificate_type, orgao: ORGAO_MAP[certificate_type], ...cndData })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    await supabaseService.from("infosimples_creditos").insert({
      tipo_consulta: `cnd_${certificate_type}`,
      creditos_usados: creditosUsados,
      cnpj_consultado: cleanCnpj,
      custo_estimado: certificate_type === "federal" ? 1.5 : certificate_type === "fgts" ? 1.0 : 1.2,
      sucesso: apiData.code === 200,
      query_id: apiData.query_id,
      user_id: userId,
    });

    return new Response(
      JSON.stringify({ success: true, certificate: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno ao processar a solicitação" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
