import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type CndTipo = "federal" | "estadual" | "fgts" | "municipal" | "trabalhista";
export type CndStatus = "valida" | "vencendo" | "vencida" | "pendente" | "erro";

export interface CndCertidao {
  id: string;
  client_id: string;
  tipo: CndTipo;
  orgao: string;
  numero_certidao: string | null;
  codigo_controle: string | null;
  data_emissao: string | null;
  data_validade: string | null;
  situacao: string | null;
  status: CndStatus;
  arquivo_url: string | null;
  arquivo_nome: string | null;
  pdf_base64: string | null;
  infosimples_query_id: string | null;
  infosimples_status: string | null;
  infosimples_creditos_usados: number | null;
  obtida_automaticamente: boolean;
  proximo_check: string | null;
  alertado: boolean;
  api_response: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    company_name: string;
    trade_name: string | null;
    cnpj: string;
  };
}

export interface CndFilters {
  tipo?: CndTipo;
  status?: CndStatus;
  clientId?: string;
}

export const CND_TIPO_LABELS: Record<CndTipo, string> = {
  federal: "CND Federal (PGFN)",
  estadual: "CND Estadual (SEFAZ)",
  fgts: "CRF FGTS (Caixa)",
  municipal: "CND Municipal",
  trabalhista: "CND Trabalhista (TST)",
};

export const CND_ORGAO_LABELS: Record<string, string> = {
  receita_federal: "Receita Federal",
  sefaz: "SEFAZ",
  caixa: "Caixa Econômica",
  prefeitura: "Prefeitura",
  tst: "TST",
};

export const CND_STATUS_LABELS: Record<CndStatus, string> = {
  valida: "Válida",
  vencendo: "Vencendo",
  vencida: "Vencida",
  pendente: "Pendente",
  erro: "Erro",
};

export const useCndCertidoes = (filters?: CndFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cnd-certidoes", filters],
    queryFn: async () => {
      let query = supabase
        .from("cnd_certidoes")
        .select(`
          *,
          clients(id, company_name, trade_name, cnpj)
        `)
        .order("updated_at", { ascending: false });

      if (filters?.tipo) {
        query = query.eq("tipo", filters.tipo);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as CndCertidao[];
    },
    enabled: !!user,
  });
};

export const useCndStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cnd-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cnd_certidoes")
        .select("status, tipo");

      if (error) throw error;

      const stats = {
        total: data.length,
        valida: data.filter((c) => c.status === "valida").length,
        vencendo: data.filter((c) => c.status === "vencendo").length,
        vencida: data.filter((c) => c.status === "vencida").length,
        pendente: data.filter((c) => c.status === "pendente").length,
        erro: data.filter((c) => c.status === "erro").length,
        byTipo: {
          federal: data.filter((c) => c.tipo === "federal").length,
          estadual: data.filter((c) => c.tipo === "estadual").length,
          fgts: data.filter((c) => c.tipo === "fgts").length,
          municipal: data.filter((c) => c.tipo === "municipal").length,
          trabalhista: data.filter((c) => c.tipo === "trabalhista").length,
        },
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useConsultarCnd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      client_id,
      tipo,
    }: {
      client_id: string;
      tipo: "federal" | "fgts" | "estadual";
    }) => {
      const { data, error } = await supabase.functions.invoke("consulta-cnd", {
        body: { client_id, tipo },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cnd-certidoes"] });
      queryClient.invalidateQueries({ queryKey: ["cnd-stats"] });
      
      const statusMessages: Record<string, string> = {
        valida: "Certidão regular encontrada!",
        vencendo: "Certidão encontrada, porém prestes a vencer",
        vencida: "Certidão vencida",
        pendente: "Consulta em processamento",
        erro: "Erro ou pendências na consulta",
      };
      
      toast({
        title: "Consulta realizada",
        description: statusMessages[data.cnd.status] || "Consulta concluída",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na consulta",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCnd = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cnd_certidoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cnd-certidoes"] });
      queryClient.invalidateQueries({ queryKey: ["cnd-stats"] });
      toast({
        title: "CND removida",
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

export const useLogsAutomacao = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["logs-automacao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("logs_automacao")
        .select(`
          *,
          clients(company_name, cnpj)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreditosInfosimples = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creditos-infosimples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("infosimples_creditos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const totalCreditos = data.reduce((acc, c) => acc + (c.creditos_usados || 0), 0);
      const custoTotal = data.reduce((acc, c) => acc + (c.custo_estimado || 0), 0);

      return {
        logs: data,
        totalCreditos,
        custoTotal,
      };
    },
    enabled: !!user,
  });
};
