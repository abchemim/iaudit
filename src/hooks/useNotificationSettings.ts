import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  cert_expiry_alert: boolean;
  declarations_alert: boolean;
  fgts_alert: boolean;
  tarefas_alert: boolean;
  dias_antecedencia_tarefas: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettingsUpdate {
  email_enabled?: boolean;
  whatsapp_enabled?: boolean;
  cert_expiry_alert?: boolean;
  declarations_alert?: boolean;
  fgts_alert?: boolean;
  tarefas_alert?: boolean;
  dias_antecedencia_tarefas?: number;
}

export const useNotificationSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notification-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as NotificationSettings | null;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: NotificationSettingsUpdate) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Check if settings exist
      const { data: existing } = await supabase
        .from("notification_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("notification_settings")
          .update(updates)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("notification_settings")
          .insert({ user_id: user.id, ...updates })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram atualizadas.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as preferências.",
        variant: "destructive",
      });
    },
  });
};
