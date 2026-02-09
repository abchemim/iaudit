import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type TarefaStatus = "pendente" | "em_andamento" | "concluida";
export type TarefaPrioridade = "baixa" | "media" | "alta";
export type TarefaTipo = "verificacao" | "renovacao" | "correcao" | "outro";

export interface Tarefa {
  id: string;
  client_id: string | null;
  user_id: string | null;
  titulo: string;
  descricao: string | null;
  tipo: TarefaTipo;
  relacionado_tipo: string | null;
  relacionado_id: string | null;
  prioridade: TarefaPrioridade;
  status: TarefaStatus;
  vencimento: string | null;
  concluido_em: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    company_name: string;
    trade_name: string | null;
    cnpj: string;
  };
}

export interface TarefaFilters {
  status?: TarefaStatus;
  prioridade?: TarefaPrioridade;
  clientId?: string;
}

export const TAREFA_STATUS_LABELS: Record<TarefaStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

export const TAREFA_PRIORIDADE_LABELS: Record<TarefaPrioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const useTarefas = (filters?: TarefaFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tarefas", filters],
    queryFn: async () => {
      let query = supabase
        .from("tarefas")
        .select(`
          *,
          clients(id, company_name, trade_name, cnpj)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.prioridade) {
        query = query.eq("prioridade", filters.prioridade);
      }
      if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Tarefa[];
    },
    enabled: !!user,
  });
};

export const useTarefasStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tarefas-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tarefas")
        .select("status, prioridade");

      if (error) throw error;

      const stats = {
        total: data.length,
        pendente: data.filter((t) => t.status === "pendente").length,
        em_andamento: data.filter((t) => t.status === "em_andamento").length,
        concluida: data.filter((t) => t.status === "concluida").length,
        alta: data.filter((t) => t.prioridade === "alta" && t.status !== "concluida").length,
        media: data.filter((t) => t.prioridade === "media" && t.status !== "concluida").length,
        baixa: data.filter((t) => t.prioridade === "baixa" && t.status !== "concluida").length,
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useUpdateTarefa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tarefa> & { id: string }) => {
      const updateData: Record<string, unknown> = { ...updates };
      
      if (updates.status === "concluida") {
        updateData.concluido_em = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("tarefas")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefas-stats"] });
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
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

export const useCreateTarefa = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tarefa: Omit<Tarefa, "id" | "created_at" | "updated_at" | "clients" | "concluido_em">) => {
      const { data, error } = await supabase
        .from("tarefas")
        .insert({
          ...tarefa,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefas-stats"] });
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTarefa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tarefas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefas-stats"] });
      toast({
        title: "Tarefa removida",
        description: "A tarefa foi excluída com sucesso.",
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
