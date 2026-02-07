import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CompanySettings {
  id: string;
  user_id: string;
  company_name: string | null;
  company_cnpj: string | null;
  crc: string | null;
  company_phone: string | null;
  company_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySettingsUpdate {
  company_name?: string;
  company_cnpj?: string;
  crc?: string;
  company_phone?: string;
  company_address?: string;
}

export const useCompanySettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["company-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as CompanySettings | null;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateCompanySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: CompanySettingsUpdate) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Check if settings exist
      const { data: existing } = await supabase
        .from("company_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("company_settings")
          .update(updates)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("company_settings")
          .insert({ user_id: user.id, ...updates })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-settings"] });
      toast({
        title: "Dados salvos",
        description: "Os dados do escritório foram atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar os dados.",
        variant: "destructive",
      });
    },
  });
};
