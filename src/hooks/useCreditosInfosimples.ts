import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CreditoLog {
  id: string;
  tipo_consulta: string;
  creditos_usados: number;
  cnpj_consultado: string | null;
  custo_estimado: number | null;
  sucesso: boolean | null;
  query_id: string | null;
  user_id: string | null;
  created_at: string;
}

export interface RelatorioCreditosDia {
  data: string;
  tipo_consulta: string;
  total_consultas: number;
  total_creditos: number;
  custo_total: number;
}

export interface SaldoHistorico {
  id: string;
  data_consulta: string | null;
  saldo: number | null;
  saldo_creditos: number | null;
  plano: string | null;
  saldo_atual: number | null;
  creditos_usados_mes: number | null;
  api_response: Record<string, unknown> | null;
  created_at: string | null;
}

export const useCreditosLogs = (limit = 50) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creditos-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("infosimples_creditos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as CreditoLog[];
    },
    enabled: !!user,
  });
};

export const useRelatorioCreditos = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["relatorio-creditos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relatorio_creditos")
        .select("*")
        .limit(30);

      if (error) throw error;
      return data as RelatorioCreditosDia[];
    },
    enabled: !!user,
  });
};

export const useSaldoHistorico = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saldo-historico"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("infosimples_saldo_historico")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as SaldoHistorico[];
    },
    enabled: !!user,
  });
};

export const useCreditosStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creditos-stats"],
    queryFn: async () => {
      // Get last 30 days stats
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logs, error: logsError } = await supabase
        .from("infosimples_creditos")
        .select("creditos_usados, custo_estimado, tipo_consulta, sucesso")
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (logsError) throw logsError;

      // Get latest saldo
      const { data: saldo, error: saldoError } = await supabase
        .from("infosimples_saldo_historico")
        .select("saldo_atual, saldo_creditos")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (saldoError) throw saldoError;

      const totalCreditos = logs.reduce((acc, l) => acc + (l.creditos_usados || 0), 0);
      const custoTotal = logs.reduce((acc, l) => acc + (l.custo_estimado || 0), 0);
      const consultasTotal = logs.length;
      const consultasSucesso = logs.filter((l) => l.sucesso).length;

      // By type
      const byTipo = logs.reduce((acc, l) => {
        const tipo = l.tipo_consulta;
        if (!acc[tipo]) {
          acc[tipo] = { consultas: 0, creditos: 0 };
        }
        acc[tipo].consultas += 1;
        acc[tipo].creditos += l.creditos_usados || 0;
        return acc;
      }, {} as Record<string, { consultas: number; creditos: number }>);

      return {
        totalCreditos,
        custoTotal,
        consultasTotal,
        consultasSucesso,
        taxaSucesso: consultasTotal > 0 ? (consultasSucesso / consultasTotal) * 100 : 0,
        saldoAtual: saldo?.saldo_atual || saldo?.saldo_creditos || null,
        byTipo,
      };
    },
    enabled: !!user,
  });
};
