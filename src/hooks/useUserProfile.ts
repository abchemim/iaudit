import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "admin" | "accountant" | "assistant";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  email?: string; // from auth.users
}

export const useCurrentUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            name: user.email?.split("@")[0] || "Usuário",
            role: "accountant",
          })
          .select()
          .single();

        if (createError) throw createError;
        return { ...newProfile, email: user.email } as UserProfile;
      }

      return { ...data, email: user.email } as UserProfile;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Perfil atualizado",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLastLogin = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from("user_profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;
    },
  });
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  accountant: "Contador",
  assistant: "Assistente",
};
