import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Iniciando verificação de tarefas próximas do vencimento...");

    // Get all users with their notification settings
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select("user_id");

    if (usersError) {
      console.error("Erro ao buscar usuários:", usersError);
      throw usersError;
    }

    let totalNotificacoesCriadas = 0;

    for (const user of users || []) {
      // Get user notification settings
      const { data: settings } = await supabase
        .from("notification_settings")
        .select("tarefas_alert, dias_antecedencia_tarefas")
        .eq("user_id", user.user_id)
        .maybeSingle();

      // Default to enabled with 3 days if no settings
      const tarefasAlertEnabled = settings?.tarefas_alert ?? true;
      const diasAntecedencia = settings?.dias_antecedencia_tarefas ?? 3;

      if (!tarefasAlertEnabled) {
        console.log(`Alertas de tarefas desabilitados para usuário ${user.user_id}`);
        continue;
      }

      // Calculate the date range for alerts
      const hoje = new Date();
      const dataLimite = new Date();
      dataLimite.setDate(hoje.getDate() + diasAntecedencia);

      // Get tasks that are:
      // - Not completed
      // - Have a due date within the alert window
      // - Belong to this user
      const { data: tarefas, error: tarefasError } = await supabase
        .from("tarefas")
        .select(`
          id,
          titulo,
          vencimento,
          prioridade,
          client_id,
          clients(company_name, cnpj)
        `)
        .eq("user_id", user.user_id)
        .neq("status", "concluida")
        .not("vencimento", "is", null)
        .lte("vencimento", dataLimite.toISOString().split("T")[0])
        .gte("vencimento", hoje.toISOString().split("T")[0]);

      if (tarefasError) {
        console.error(`Erro ao buscar tarefas do usuário ${user.user_id}:`, tarefasError);
        continue;
      }

      console.log(`Encontradas ${tarefas?.length || 0} tarefas próximas do vencimento para usuário ${user.user_id}`);

      for (const tarefa of tarefas || []) {
        // Check if we already sent a notification for this task today
        const { data: existingNotification } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.user_id)
          .eq("type", "tarefa_vencimento")
          .ilike("message", `%${tarefa.id}%`)
          .gte("created_at", hoje.toISOString().split("T")[0])
          .maybeSingle();

        if (existingNotification) {
          console.log(`Notificação já enviada hoje para tarefa ${tarefa.id}`);
          continue;
        }

        // Calculate days until due
        const vencimento = new Date(tarefa.vencimento);
        const diffTime = vencimento.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let urgencia = "";
        if (diffDays === 0) {
          urgencia = "VENCE HOJE";
        } else if (diffDays === 1) {
          urgencia = "vence amanhã";
        } else {
          urgencia = `vence em ${diffDays} dias`;
        }

        const clienteNome = tarefa.clients?.company_name || "Sem cliente";

        // Create notification
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            user_id: user.user_id,
            client_id: tarefa.client_id,
            title: `Tarefa ${urgencia}`,
            message: `A tarefa "${tarefa.titulo}" ${urgencia}. Cliente: ${clienteNome}. ID: ${tarefa.id}`,
            type: "tarefa_vencimento",
            is_read: false,
          });

        if (notifError) {
          console.error(`Erro ao criar notificação para tarefa ${tarefa.id}:`, notifError);
        } else {
          console.log(`Notificação criada para tarefa ${tarefa.id}`);
          totalNotificacoesCriadas++;
        }
      }
    }

    console.log(`Verificação concluída. ${totalNotificacoesCriadas} notificações criadas.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Verificação concluída. ${totalNotificacoesCriadas} notificações criadas.`,
        notificacoes_criadas: totalNotificacoesCriadas,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro na verificação de tarefas:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
