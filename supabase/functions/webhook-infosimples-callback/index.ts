import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

// Edge function para receber callbacks da InfoSimples
// Quando uma consulta é concluída, a InfoSimples pode enviar o resultado via webhook

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret for authentication - REQUIRED
    const WEBHOOK_SECRET = Deno.env.get("INFOSIMPLES_WEBHOOK_SECRET");
    
    // Reject if webhook secret is not configured
    if (!WEBHOOK_SECRET || WEBHOOK_SECRET.length === 0) {
      console.error("INFOSIMPLES_WEBHOOK_SECRET not configured - rejecting request");
      return new Response(
        JSON.stringify({ error: "Webhook authentication not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const providedSecret = req.headers.get("X-Webhook-Secret");
    if (!providedSecret || providedSecret !== WEBHOOK_SECRET) {
      console.error("Unauthorized webhook request - invalid or missing secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.json();
    console.log("Callback InfoSimples recebido:", JSON.stringify(payload));

    // Validate required fields
    const { query_id, code, data, credits_used, message } = payload;

    if (!query_id || typeof query_id !== "string") {
      return new Response(
        JSON.stringify({ received: false, error: "query_id inválido ou não fornecido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Buscar CND pelo query_id
    const { data: cnd, error: cndError } = await supabase
      .from("cnd_certidoes")
      .select("id, client_id, tipo")
      .eq("infosimples_query_id", query_id)
      .maybeSingle();

    if (cndError) {
      console.error("Erro ao buscar CND:", cndError);
      throw cndError;
    }

    if (!cnd) {
      console.log(`CND não encontrada para query_id: ${query_id}`);
      // Log do callback mesmo assim
      await supabase.from("logs_automacao").insert({
        acao: "callback_infosimples",
        status: "aviso",
        mensagem: `Callback recebido para query_id desconhecido: ${query_id}`,
        dados_retorno: payload,
      });

      return new Response(
        JSON.stringify({ received: true, found: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Processar dados do callback
    let status = "pendente";
    let situacao: string | null = null;
    let dataValidade: string | null = null;
    let dataEmissao: string | null = null;
    let numeroCertidao: string | null = null;
    let codigoControle: string | null = null;
    let pdfBase64: string | null = null;

    if (code === 200 && data && data.length > 0) {
      const certData = data[0];

      // Parse baseado no tipo
      situacao = certData.situacao || certData.situacao_regularidade;
      numeroCertidao = certData.numero || certData.numero_certidao || certData.numero_crf;
      codigoControle = certData.codigo_controle || certData.codigo_verificacao;
      pdfBase64 = certData.pdf;

      // Parse datas (formato DD/MM/YYYY para YYYY-MM-DD)
      const parseDate = (dateStr: string | undefined): string | null => {
        if (!dateStr) return null;
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      dataValidade = parseDate(certData.data_validade || certData.validade);
      dataEmissao = parseDate(certData.data_emissao);

      // Determinar status
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
          const diasRestantes = Math.floor(
            (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
          );

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
    } else if (code === 600 || code === 601) {
      status = "pendente";
      situacao = message || "Consulta em processamento";
    } else {
      status = "erro";
      situacao = message || "Erro na consulta";
    }

    // Atualizar CND
    const { error: updateError } = await supabase
      .from("cnd_certidoes")
      .update({
        status,
        situacao,
        numero_certidao: numeroCertidao,
        codigo_controle: codigoControle,
        data_emissao: dataEmissao,
        data_validade: dataValidade,
        pdf_base64: pdfBase64,
        infosimples_status: code === 200 ? "concluida" : "erro",
        infosimples_creditos_usados: credits_used || 0,
        api_response: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cnd.id);

    if (updateError) {
      console.error("Erro ao atualizar CND:", updateError);
      throw updateError;
    }

    // Log do callback
    await supabase.from("logs_automacao").insert({
      client_id: cnd.client_id,
      acao: "callback_infosimples",
      status: code === 200 ? "sucesso" : "erro",
      mensagem: `Callback recebido para CND ${cnd.tipo}: ${situacao || message}`,
      dados_retorno: payload,
      infosimples_query_id: query_id,
      infosimples_creditos: credits_used || 0,
    });

    console.log(`CND ${cnd.id} atualizada via callback: status=${status}`);

    return new Response(
      JSON.stringify({
        received: true,
        cnd_id: cnd.id,
        status_updated: status,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ received: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
