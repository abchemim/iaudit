import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type DeclarationType = "pgdas" | "pgmei" | "dctfweb" | "sped_fiscal" | "sped_contabil" | "ecd" | "ecf";
export type DeclarationStatus = "ok" | "pending" | "attention" | "expired";

export interface TaxDeclaration {
  id: string;
  client_id: string;
  type: DeclarationType;
  competence_month: string;
  status: DeclarationStatus;
  due_date: string | null;
  submitted_at: string | null;
  receipt_number: string | null;
  tax_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    company_name: string;
    trade_name: string | null;
    cnpj: string;
  };
}

export interface DeclarationFilters {
  type?: DeclarationType;
  status?: DeclarationStatus;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export const DECLARATION_TYPE_LABELS: Record<DeclarationType, string> = {
  pgdas: "PGDAS-D",
  pgmei: "PGMEI",
  dctfweb: "DCTFWeb",
  sped_fiscal: "SPED Fiscal",
  sped_contabil: "SPED Contábil",
  ecd: "ECD",
  ecf: "ECF",
};

export const useDeclarations = (filters?: DeclarationFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["declarations", filters],
    queryFn: async () => {
      let query = supabase
        .from("tax_declarations")
        .select(`
          *,
          client:clients(id, company_name, trade_name, cnpj)
        `)
        .order("competence_month", { ascending: false });

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
      }
      if (filters?.startDate) {
        query = query.gte("competence_month", filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte("competence_month", filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TaxDeclaration[];
    },
    enabled: !!user,
  });
};

export const useDeclarationStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["declaration-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_declarations")
        .select("status, type");

      if (error) throw error;

      const stats = {
        total: data.length,
        ok: data.filter((d) => d.status === "ok").length,
        pending: data.filter((d) => d.status === "pending").length,
        attention: data.filter((d) => d.status === "attention").length,
        expired: data.filter((d) => d.status === "expired").length,
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useCreateDeclaration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      declaration: Omit<TaxDeclaration, "id" | "created_at" | "updated_at" | "client">
    ) => {
      const { data, error } = await supabase
        .from("tax_declarations")
        .insert(declaration)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["declaration-stats"] });
      toast({
        title: "Declaração criada",
        description: "A declaração foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDeclaration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<TaxDeclaration> & { id: string }) => {
      const { data, error } = await supabase
        .from("tax_declarations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["declaration-stats"] });
      toast({
        title: "Declaração atualizada",
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

export const useDeleteDeclaration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tax_declarations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["declaration-stats"] });
      toast({
        title: "Declaração removida",
        description: "O registro foi excluído com sucesso.",
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
