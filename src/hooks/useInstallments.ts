import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type InstallmentStatus = "ok" | "pending" | "attention" | "expired";

export interface Installment {
  id: string;
  client_id: string;
  program_name: string;
  total_amount: number;
  paid_amount: number | null;
  installment_count: number;
  current_installment: number | null;
  monthly_amount: number | null;
  start_date: string | null;
  next_due_date: string | null;
  status: InstallmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    company_name: string;
    cnpj: string;
  };
}

interface UseInstallmentsOptions {
  status?: InstallmentStatus;
  clientId?: string;
}

export const useInstallments = (options: UseInstallmentsOptions = {}) => {
  const { user } = useAuth();
  const { status, clientId } = options;

  return useQuery({
    queryKey: ["installments", status, clientId],
    queryFn: async () => {
      let query = supabase
        .from("installments")
        .select(`
          *,
          clients (
            company_name,
            cnpj
          )
        `)
        .order("next_due_date", { ascending: true });

      if (status) {
        query = query.eq("status", status);
      }

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Installment[];
    },
    enabled: !!user,
  });
};

export const useInstallmentStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["installment-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("installments")
        .select("status, total_amount, paid_amount");

      if (error) throw error;

      const stats = {
        total: data.length,
        ok: data.filter((i) => i.status === "ok").length,
        pending: data.filter((i) => i.status === "pending").length,
        attention: data.filter((i) => i.status === "attention").length,
        expired: data.filter((i) => i.status === "expired").length,
        totalValue: data.reduce((sum, i) => sum + (i.total_amount || 0), 0),
        paidValue: data.reduce((sum, i) => sum + (i.paid_amount || 0), 0),
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useCreateInstallment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      installment: Omit<Installment, "id" | "created_at" | "updated_at" | "clients">
    ) => {
      const { data, error } = await supabase
        .from("installments")
        .insert(installment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({ queryKey: ["installment-stats"] });
      toast({
        title: "Parcelamento cadastrado",
        description: "O parcelamento foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateInstallment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Installment> & { id: string }) => {
      const { data, error } = await supabase
        .from("installments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({ queryKey: ["installment-stats"] });
      toast({
        title: "Parcelamento atualizado",
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

export const useDeleteInstallment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("installments").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({ queryKey: ["installment-stats"] });
      toast({
        title: "Parcelamento excluído",
        description: "O registro foi removido.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
