import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AlertRequest {
  client_id: string;
  cnd_id: string;
  tipo: string;
  dias_vencimento: number;
  arquivo_url?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { client_id, cnd_id, tipo, dias_vencimento, arquivo_url }: AlertRequest = await req.json();

    // Buscar empresa
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("cnpj, company_name, user_id")
      .eq("id", client_id)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ success: false, error: "Cliente não encontrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Buscar configurações de alerta
    const { data: config } = await supabase
      .from("configuracoes_alertas")
      .select("*")
      .eq("user_id", client.user_id)
      .eq("client_id", client_id)
      .maybeSingle();

    let alertConfig = config;
    if (!alertConfig) {
      const { data: generalConfig } = await supabase
        .from("configuracoes_alertas")
        .select("*")
        .eq("user_id", client.user_id)
        .is("client_id", null)
        .maybeSingle();
      alertConfig = generalConfig;
    }

    if (alertConfig && !alertConfig.alerta_cnd_vencimento) {
      return new Response(
        JSON.stringify({ sent: false, reason: "Alertas desativados" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const tipoFormatado =
      tipo === "federal" ? "Federal (PGFN)" :
      tipo === "fgts" ? "FGTS (Caixa)" :
      tipo === "estadual" ? "Estadual (SEFAZ)" :
      tipo === "municipal" ? "Municipal" :
      tipo === "trabalhista" ? "Trabalhista (TST)" : tipo;

    const prioridade = dias_vencimento <= 5 ? "alta" : dias_vencimento <= 10 ? "media" : "baixa";

    // Criar notificação interna
    await supabase.from("notifications").insert({
      user_id: client.user_id,
      client_id,
      type: dias_vencimento <= 5 ? "error" : "warning",
      title: `⚠️ CND ${tipoFormatado} vencendo`,
      message: `A CND ${tipoFormatado} da empresa ${client.company_name} (${client.cnpj}) vence em ${dias_vencimento} dias.`,
    });

    // Criar tarefa de renovação
    const vencimentoData = new Date();
    vencimentoData.setDate(vencimentoData.getDate() + dias_vencimento);

    await supabase.from("tarefas").insert({
      client_id,
      user_id: client.user_id,
      titulo: `Renovar CND ${tipoFormatado}`,
      descricao: `A CND ${tipoFormatado} da empresa ${client.company_name} vence em ${dias_vencimento} dias. É necessário verificar a regularidade fiscal e emitir nova certidão.`,
      tipo: "verificacao",
      relacionado_tipo: "cnd",
      relacionado_id: cnd_id,
      prioridade,
      status: "pendente",
      vencimento: vencimentoData.toISOString().split("T")[0],
    });

    // Marcar como alertado
    await supabase
      .from("cnd_certidoes")
      .update({ alertado: true })
      .eq("id", cnd_id);

    // Log do alerta
    await supabase.from("logs_automacao").insert({
      client_id,
      acao: "envio_alerta_cnd",
      status: "sucesso",
      mensagem: `Alerta de vencimento enviado: CND ${tipo} vence em ${dias_vencimento} dias`,
      dados_retorno: { tipo, dias_vencimento, prioridade, arquivo_url, tarefa_criada: true },
    });

    return new Response(
      JSON.stringify({ sent: true, notification_created: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
