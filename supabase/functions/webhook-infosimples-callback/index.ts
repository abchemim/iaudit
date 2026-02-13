import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function uploadPdfToStorage(
  supabase: ReturnType<typeof createClient>,
  pdfBase64: string,
  clientId: string,
  tipo: string
): Promise<{ url: string; nome: string } | null> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${clientId}/${tipo}/CND_${tipo}_${timestamp}.pdf`;

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
      nome: `CND_${tipo}_${timestamp}.pdf`,
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
    const WEBHOOK_SECRET = Deno.env.get("INFOSIMPLES_WEBHOOK_SECRET");
    if (!WEBHOOK_SECRET || WEBHOOK_SECRET.length === 0) {
      console.error("INFOSIMPLES_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook authentication not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const providedSecret = req.headers.get("X-Webhook-Secret");
    if (!providedSecret || providedSecret !== WEBHOOK_SECRET) {
      console.error("Unauthorized webhook request");
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

    const { query_id, code, data, credits_used, message } = payload;

    if (!query_id || typeof query_id !== "string") {
      return new Response(
        JSON.stringify({ received: false, error: "query_id inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { data: cnd, error: cndError } = await supabase
      .from("cnd_certidoes")
      .select("id, client_id, tipo")
      .eq("infosimples_query_id", query_id)
      .maybeSingle();

    if (cndError) throw cndError;

    if (!cnd) {
      console.log(`CND não encontrada para query_id: ${query_id}`);
      await supabase.from("logs_automacao").insert({
        tipo: "webhook",
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

    let status = "pendente";
    let situacao: string | null = null;
    let dataValidade: string | null = null;
    let dataEmissao: string | null = null;
    let numeroCertidao: string | null = null;
    let codigoControle: string | null = null;
    let pdfBase64: string | null = null;

    const parseDate = (dateStr: string | undefined): string | null => {
      if (!dateStr) return null;
      const parts = dateStr.split("/");
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return dateStr;
    };

    if (code === 200 && data && data.length > 0) {
      const certData = data[0];
      situacao = certData.situacao || certData.situacao_regularidade;
      numeroCertidao = certData.numero || certData.numero_certidao || certData.numero_crf;
      codigoControle = certData.codigo_controle || certData.codigo_verificacao;
      pdfBase64 = certData.pdf;
      dataValidade = parseDate(certData.data_validade || certData.validade);
      dataEmissao = parseDate(certData.data_emissao);

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
    } else if (code === 600 || code === 601) {
      situacao = message || "Consulta em processamento";
    } else {
      status = "erro";
      situacao = message || "Erro na consulta";
    }

    // Upload PDF to storage if available
    let arquivoUrl: string | null = null;
    let arquivoNome: string | null = null;

    if (pdfBase64) {
      const uploadResult = await uploadPdfToStorage(
        supabase,
        pdfBase64,
        cnd.client_id,
        cnd.tipo
      );
      if (uploadResult) {
        arquivoUrl = uploadResult.url;
        arquivoNome = uploadResult.nome;
        console.log(`PDF uploaded to storage: ${arquivoUrl}`);
      }
    }

    const { error: updateError } = await supabase
      .from("cnd_certidoes")
      .update({
        status,
        situacao,
        numero_certidao: numeroCertidao,
        codigo_controle: codigoControle,
        data_emissao: dataEmissao,
        data_validade: dataValidade,
        arquivo_url: arquivoUrl,
        arquivo_nome: arquivoNome,
        infosimples_status: code === 200 ? "concluida" : "erro",
        infosimples_creditos_usados: credits_used || 0,
        api_response: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cnd.id);

    if (updateError) throw updateError;

    await supabase.from("logs_automacao").insert({
      tipo: "webhook",
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
      JSON.stringify({ received: true, cnd_id: cnd.id, status_updated: status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ received: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
