import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultaRequest {
  client_id: string;
  tipo: "federal" | "fgts" | "estadual";
}

const API_ENDPOINTS = {
  federal: "https://api.infosimples.com/api/v2/consultas/receita-federal/pgfn/nova",
  fgts: "https://api.infosimples.com/api/v2/consultas/caixa/regularidade",
  estadual: "https://api.infosimples.com/api/v2/consultas/sefaz/pr/certidao-debitos",
};

const ORGAO_MAP = {
  federal: "receita_federal",
  fgts: "caixa",
  estadual: "sefaz",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
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

    // Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Token inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const { client_id, tipo }: ConsultaRequest = await req.json();

    if (!client_id || !tipo) {
      return new Response(
        JSON.stringify({ success: false, error: "Parâmetros obrigatórios: client_id, tipo" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const endpoint = API_ENDPOINTS[tipo];
    if (!endpoint) {
      return new Response(
        JSON.stringify({ success: false, error: `Tipo de consulta inválido: ${tipo}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify client ownership
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

    if (client.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Acesso negado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const cleanCnpj = client.cnpj.replace(/[^\d]/g, "");
    console.log(`User ${user.id} querying ${tipo} for client ${client_id} (${cleanCnpj})`);

    // Make API request to InfoSimples
    const requestBody: Record<string, unknown> = {
      token: INFOSIMPLES_TOKEN,
      cnpj: cleanCnpj,
      timeout: 300,
    };

    // Add tipo for FGTS
    if (tipo === "fgts") {
      requestBody.tipo = "empregador";
    }

    const apiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const apiData = await apiResponse.json();
    console.log("API Response code:", apiData.code);

    // Parse response
    let status = "pendente";
    let dataValidade: string | null = null;
    let dataEmissao: string | null = null;
    let numeroCertidao: string | null = null;
    let codigoControle: string | null = null;
    let situacao: string | null = null;
    let pdfBase64: string | null = null;
    const creditosUsados = apiData.credits_used || 0;
    const queryId = apiData.query_id;

    if (apiData.code === 200 && apiData.data_count > 0) {
      const data = apiData.data[0];
      
      // Federal PGFN
      if (tipo === "federal") {
        situacao = data.situacao || data.certidao?.situacao;
        numeroCertidao = data.numero || data.certidao?.numero;
        codigoControle = data.codigo_controle || data.certidao?.codigo_controle;
        pdfBase64 = data.pdf || data.certidao?.pdf;
        
        if (data.data_validade || data.certidao?.data_validade) {
          const valStr = data.data_validade || data.certidao?.data_validade;
          const parts = valStr.split("/");
          if (parts.length === 3) {
            dataValidade = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        if (data.data_emissao || data.certidao?.data_emissao) {
          const emStr = data.data_emissao || data.certidao?.data_emissao;
          const parts = emStr.split("/");
          if (parts.length === 3) {
            dataEmissao = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
      }
      
      // FGTS
      if (tipo === "fgts") {
        situacao = data.situacao_regularidade || data.situacao;
        numeroCertidao = data.numero_crf || data.numero;
        pdfBase64 = data.pdf;
        
        if (data.data_validade) {
          const parts = data.data_validade.split("/");
          if (parts.length === 3) {
            dataValidade = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        if (data.data_emissao) {
          const parts = data.data_emissao.split("/");
          if (parts.length === 3) {
            dataEmissao = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
      }
      
      // Estadual
      if (tipo === "estadual") {
        situacao = data.situacao;
        numeroCertidao = data.numero_certidao || data.numero;
        codigoControle = data.codigo_verificacao;
        pdfBase64 = data.pdf;
        
        if (data.validade) {
          const parts = data.validade.split("/");
          if (parts.length === 3) {
            dataValidade = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
      }

      // Determine status based on situacao and validade
      const situacaoLower = situacao?.toLowerCase() || "";
      if (situacaoLower.includes("regular") || 
          situacaoLower.includes("negativa") || 
          situacaoLower.includes("nada consta") ||
          situacaoLower.includes("positiva com efeito")) {
        
        // Check if expiring soon
        if (dataValidade) {
          const hoje = new Date();
          const validade = new Date(dataValidade);
          const diasRestantes = Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diasRestantes < 0) {
            status = "vencida";
          } else if (diasRestantes <= 15) {
            status = "vencendo";
          } else {
            status = "valida";
          }
        } else {
          status = "valida";
        }
      } else if (situacaoLower.includes("pendente") || situacaoLower.includes("pendência")) {
        status = "erro";
      } else {
        status = "pendente";
      }
    } else if (apiData.code === 600 || apiData.code === 601) {
      status = "pendente";
      situacao = apiData.message || "Consulta em processamento";
    } else {
      status = "erro";
      situacao = apiData.message || "Erro na consulta";
    }

    // Calculate proximo_check (15 days from now)
    const proximoCheck = new Date();
    proximoCheck.setDate(proximoCheck.getDate() + 15);

    // Use service role for database operations
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if CND already exists
    const { data: existingCnd } = await supabaseService
      .from("cnd_certidoes")
      .select("id")
      .eq("client_id", client_id)
      .eq("tipo", tipo)
      .maybeSingle();

    let result;

    const cndData = {
      status,
      situacao,
      numero_certidao: numeroCertidao,
      codigo_controle: codigoControle,
      data_emissao: dataEmissao,
      data_validade: dataValidade,
      pdf_base64: pdfBase64,
      infosimples_query_id: queryId,
      infosimples_status: apiData.code === 200 ? "concluida" : "erro",
      infosimples_creditos_usados: creditosUsados,
      obtida_automaticamente: false,
      proximo_check: proximoCheck.toISOString().split("T")[0],
      api_response: apiData,
      updated_at: new Date().toISOString(),
    };

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
        .insert({
          client_id,
          tipo,
          orgao: ORGAO_MAP[tipo],
          ...cndData,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Log credits
    await supabaseService.from("infosimples_creditos").insert({
      tipo_consulta: `cnd_${tipo}`,
      creditos_usados: creditosUsados,
      cnpj_consultado: cleanCnpj,
      custo_estimado: tipo === "federal" ? 1.5 : tipo === "fgts" ? 1.0 : 1.2,
      sucesso: apiData.code === 200,
      query_id: queryId,
      user_id: user.id,
    });

    // Log automation
    const tempoExecucao = (Date.now() - startTime) / 1000;
    await supabaseService.from("logs_automacao").insert({
      client_id,
      workflow_n8n: null,
      acao: `consulta_cnd_${tipo}`,
      infosimples_query_id: queryId,
      infosimples_creditos: creditosUsados,
      status: apiData.code === 200 ? "sucesso" : "erro",
      mensagem: apiData.code === 200 ? `CND ${tipo} consultada com sucesso` : situacao,
      dados_retorno: apiData,
      tempo_execucao: tempoExecucao,
    });

    return new Response(
      JSON.stringify({
        success: true,
        cnd: result,
        creditos_usados: creditosUsados,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno ao processar a solicitação",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
