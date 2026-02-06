import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type FGTSStatus = "ok" | "pending" | "attention" | "expired";

export interface FGTSRecord {
  id: string;
  client_id: string;
  competence_month: string;
  status: FGTSStatus;
  due_date: string | null;
  amount: number | null;
  paid_amount: number | null;
  paid_at: string | null;
  guide_number: string | null;
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

export interface FGTSFilters {
  status?: FGTSStatus;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export const useFGTSRecords = (filters?: FGTSFilters) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["fgts-records", filters],
    queryFn: async () => {
      let query = supabase
        .from("fgts_records")
        .select(`
          *,
          client:clients(id, company_name, trade_name, cnpj)
        `)
        .order("competence_month", { ascending: false });

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
      return data as FGTSRecord[];
    },
    enabled: !!user,
  });
};

export const useFGTSStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["fgts-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fgts_records")
        .select("status");
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        ok: data.filter(r => r.status === "ok").length,
        pending: data.filter(r => r.status === "pending").length,
        attention: data.filter(r => r.status === "attention").length,
        expired: data.filter(r => r.status === "expired").length,
      };
      
      return stats;
    },
    enabled: !!user,
  });
};

export const useCreateFGTSRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (record: Omit<FGTSRecord, "id" | "created_at" | "updated_at" | "client">) => {
      const { data, error } = await supabase
        .from("fgts_records")
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fgts-records"] });
      queryClient.invalidateQueries({ queryKey: ["fgts-stats"] });
      toast({
        title: "Guia FGTS criada",
        description: "A guia foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar guia",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFGTSRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FGTSRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from("fgts_records")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fgts-records"] });
      queryClient.invalidateQueries({ queryKey: ["fgts-stats"] });
      toast({
        title: "Guia atualizada",
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

export const useDeleteFGTSRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fgts_records")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fgts-records"] });
      queryClient.invalidateQueries({ queryKey: ["fgts-stats"] });
      toast({
        title: "Guia removida",
        description: "A guia foi excluída com sucesso.",
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
