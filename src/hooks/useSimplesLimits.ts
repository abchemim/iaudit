import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type SimplesStatus = "ok" | "pending" | "attention" | "expired";

export interface SimplesLimit {
  id: string;
  client_id: string;
  year: number;
  limit_amount: number;
  accumulated_revenue: number;
  percentage_used: number | null;
  status: SimplesStatus;
  updated_at: string;
  clients?: {
    company_name: string;
    cnpj: string;
    tax_regime: string;
  };
}

interface UseSimplesLimitsOptions {
  status?: SimplesStatus;
  clientId?: string;
  year?: number;
}

export const useSimplesLimits = (options: UseSimplesLimitsOptions = {}) => {
  const { user } = useAuth();
  const { status, clientId, year } = options;

  return useQuery({
    queryKey: ["simples-limits", status, clientId, year],
    queryFn: async () => {
      let query = supabase
        .from("simples_limits")
        .select(`
          *,
          clients (
            company_name,
            cnpj,
            tax_regime
          )
        `)
        .order("percentage_used", { ascending: false, nullsFirst: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      if (year) {
        query = query.eq("year", year);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SimplesLimit[];
    },
    enabled: !!user,
  });
};

export const useSimplesStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["simples-stats"],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      
      const { data, error } = await supabase
        .from("simples_limits")
        .select("status, percentage_used")
        .eq("year", currentYear);

      if (error) throw error;

      const stats = {
        total: data.length,
        ok: data.filter((s) => s.status === "ok").length,
        attention: data.filter((s) => s.status === "attention").length,
        expired: data.filter((s) => s.status === "expired").length,
        avgPercentage: data.length > 0
          ? data.reduce((sum, s) => sum + (s.percentage_used || 0), 0) / data.length
          : 0,
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useCreateSimplesLimit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      limit: Omit<SimplesLimit, "id" | "updated_at" | "clients">
    ) => {
      // Calculate percentage
      const percentage_used = (limit.accumulated_revenue / limit.limit_amount) * 100;
      
      // Determine status based on percentage
      let status: SimplesStatus = "ok";
      if (percentage_used >= 100) {
        status = "expired";
      } else if (percentage_used >= 80) {
        status = "attention";
      }

      const { data, error } = await supabase
        .from("simples_limits")
        .insert({ ...limit, percentage_used, status })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simples-limits"] });
      queryClient.invalidateQueries({ queryKey: ["simples-stats"] });
      toast({
        title: "Sublimite cadastrado",
        description: "O registro foi adicionado com sucesso.",
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

export const useUpdateSimplesLimit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<SimplesLimit> & { id: string }) => {
      // Recalculate if revenue or limit changed
      let finalUpdates = { ...updates };
      
      if (updates.accumulated_revenue !== undefined || updates.limit_amount !== undefined) {
        const { data: current } = await supabase
          .from("simples_limits")
          .select("accumulated_revenue, limit_amount")
          .eq("id", id)
          .single();

        if (current) {
          const revenue = updates.accumulated_revenue ?? current.accumulated_revenue;
          const limit = updates.limit_amount ?? current.limit_amount;
          const percentage_used = (revenue / limit) * 100;
          
          let status: SimplesStatus = "ok";
          if (percentage_used >= 100) {
            status = "expired";
          } else if (percentage_used >= 80) {
            status = "attention";
          }

          finalUpdates = { ...finalUpdates, percentage_used, status };
        }
      }

      const { data, error } = await supabase
        .from("simples_limits")
        .update(finalUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simples-limits"] });
      queryClient.invalidateQueries({ queryKey: ["simples-stats"] });
      toast({
        title: "Sublimite atualizado",
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
