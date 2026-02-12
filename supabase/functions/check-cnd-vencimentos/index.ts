import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Edge function para verificar CNDs prestes a vencer
// Chamada via cron job agendado

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

    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 15);

    const { data: cndsVencendo, error } = await supabase
      .from("cnd_certidoes")
      .select(`
        id, client_id, tipo, data_validade, arquivo_url, alertado,
        clients (cnpj, company_name, user_id)
      `)
      .gte("data_validade", hoje.toISOString().split("T")[0])
      .lte("data_validade", limite.toISOString().split("T")[0])
      .eq("alertado", false)
      .in("status", ["valida", "vencendo"]);

    if (error) throw error;

    console.log(`Encontradas ${cndsVencendo?.length || 0} CNDs prestes a vencer`);

    const alertas: Array<{ cnd_id: string; success: boolean }> = [];

    for (const cnd of cndsVencendo || []) {
      const diasVencimento = Math.floor(
        (new Date(cnd.data_validade!).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );

      await supabase
        .from("cnd_certidoes")
        .update({ status: "vencendo" })
        .eq("id", cnd.id);

      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-cnd-alert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            client_id: cnd.client_id,
            cnd_id: cnd.id,
            tipo: cnd.tipo,
            dias_vencimento: diasVencimento,
            arquivo_url: cnd.arquivo_url,
          }),
        });

        const result = await response.json();
        alertas.push({ cnd_id: cnd.id, success: result.sent || false });
      } catch (alertError) {
        console.error(`Erro ao enviar alerta para CND ${cnd.id}:`, alertError);
        alertas.push({ cnd_id: cnd.id, success: false });
      }
    }

    // Atualizar CNDs vencidas
    const { data: cndsVencidas } = await supabase
      .from("cnd_certidoes")
      .select("id")
      .lt("data_validade", hoje.toISOString().split("T")[0])
      .neq("status", "vencida");

    if (cndsVencidas && cndsVencidas.length > 0) {
      await supabase
        .from("cnd_certidoes")
        .update({ status: "vencida" })
        .in("id", cndsVencidas.map((c) => c.id));

      console.log(`Atualizadas ${cndsVencidas.length} CNDs como vencidas`);
    }

    await supabase.from("logs_automacao").insert({
      acao: "verificacao_vencimentos",
      status: "sucesso",
      mensagem: `Verificação concluída: ${cndsVencendo?.length || 0} CNDs vencendo, ${alertas.filter((a) => a.success).length} alertas enviados`,
      dados_retorno: {
        cnds_vencendo: cndsVencendo?.length || 0,
        cnds_vencidas_atualizadas: cndsVencidas?.length || 0,
        alertas,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        cnds_verificadas: cndsVencendo?.length || 0,
        cnds_vencidas_atualizadas: cndsVencidas?.length || 0,
        alertas_enviados: alertas.filter((a) => a.success).length,
      }),
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
