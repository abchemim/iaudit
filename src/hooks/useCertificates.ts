import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type CertificateType = "cnd_federal" | "cnd_estadual" | "cnd_municipal" | "cnd_trabalhista" | "cnd_fgts";
export type CertificateStatus = "ok" | "pending" | "attention" | "expired";

export interface Certificate {
  id: string;
  client_id: string;
  type: CertificateType;
  status: CertificateStatus;
  certificate_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  document_url: string | null;
  notes: string | null;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    company_name: string;
    trade_name: string | null;
    cnpj: string;
  };
}

export interface CertificateFilters {
  type?: CertificateType;
  status?: CertificateStatus;
  clientId?: string;
}

export const CERTIFICATE_TYPE_LABELS: Record<CertificateType, string> = {
  cnd_federal: "CND Federal (PGFN)",
  cnd_estadual: "CND Estadual",
  cnd_municipal: "CND Municipal",
  cnd_trabalhista: "CND Trabalhista",
  cnd_fgts: "CRF FGTS",
};

export const useCertificates = (filters?: CertificateFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["certificates", filters],
    queryFn: async () => {
      let query = supabase
        .from("certificates")
        .select(`
          *,
          client:clients(id, company_name, trade_name, cnpj)
        `)
        .order("updated_at", { ascending: false });

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Certificate[];
    },
    enabled: !!user,
  });
};

export const useCertificateStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["certificate-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("status, type");

      if (error) throw error;

      const stats = {
        total: data.length,
        ok: data.filter((c) => c.status === "ok").length,
        pending: data.filter((c) => c.status === "pending").length,
        attention: data.filter((c) => c.status === "attention").length,
        expired: data.filter((c) => c.status === "expired").length,
        byType: {
          cnd_federal: data.filter((c) => c.type === "cnd_federal").length,
          cnd_estadual: data.filter((c) => c.type === "cnd_estadual").length,
          cnd_municipal: data.filter((c) => c.type === "cnd_municipal").length,
          cnd_trabalhista: data.filter((c) => c.type === "cnd_trabalhista").length,
          cnd_fgts: data.filter((c) => c.type === "cnd_fgts").length,
        },
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useQueryCertificate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      client_id,
      certificate_type,
      cnpj,
    }: {
      client_id: string;
      certificate_type: "cnd_federal" | "cnd_estadual" | "cnd_fgts";
      cnpj: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("query-certificate", {
        body: { client_id, certificate_type, cnpj },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificate-stats"] });
      
      const statusMessages: Record<string, string> = {
        ok: "Certidão regular encontrada!",
        pending: "Consulta em processamento",
        attention: "Há pendências na certidão",
        expired: "Certidão vencida",
      };
      
      toast({
        title: "Consulta realizada",
        description: statusMessages[data.certificate.status] || "Consulta concluída",
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

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificate-stats"] });
      toast({
        title: "Certidão removida",
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
