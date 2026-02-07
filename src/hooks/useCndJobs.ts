import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";

export interface CndJob {
  id: string;
  client_id: string;
  tipo: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  result: {
    cnd: Record<string, unknown>;
    creditos_usados: number;
  } | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export const useCndJobPolling = (jobId: string | null) => {
  const [job, setJob] = useState<CndJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    let isCancelled = false;

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from("cnd_consultas_jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;
        if (isCancelled) return;

        // Cast the data properly
        const jobData: CndJob = {
          id: data.id,
          client_id: data.client_id,
          tipo: data.tipo,
          status: data.status as "processing" | "completed" | "failed",
          progress: data.progress ?? 0,
          result: data.result as CndJob["result"],
          error: data.error,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        setJob(jobData);

        if (jobData.status === "processing") {
          // Continue polling every 2 seconds
          setTimeout(poll, 2000);
        } else {
          setIsPolling(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
        if (!isCancelled) {
          setIsPolling(false);
        }
      }
    };

    poll();

    return () => {
      isCancelled = true;
    };
  }, [jobId]);

  return { job, isPolling };
};

export const useConsultarCndAsync = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const { job, isPolling } = useCndJobPolling(currentJobId);

  // Handle job completion
  useEffect(() => {
    if (job && job.status === "completed") {
      queryClient.invalidateQueries({ queryKey: ["cnd-certidoes"] });
      queryClient.invalidateQueries({ queryKey: ["cnd-stats"] });

      const statusMessages: Record<string, string> = {
        valida: "Certidão regular encontrada!",
        vencendo: "Certidão encontrada, porém prestes a vencer",
        vencida: "Certidão vencida",
        pendente: "Consulta em processamento",
        erro: "Erro ou pendências na consulta",
      };

      const cndStatus = (job.result?.cnd as { status?: string })?.status || "pendente";
      toast({
        title: "Consulta concluída",
        description: statusMessages[cndStatus] || "Consulta concluída",
      });

      setCurrentJobId(null);
    } else if (job && job.status === "failed") {
      toast({
        title: "Erro na consulta",
        description: job.error || "Erro desconhecido",
        variant: "destructive",
      });
      setCurrentJobId(null);
    }
  }, [job, queryClient, toast]);

  const mutation = useMutation({
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
      setCurrentJobId(data.job_id);
      toast({
        title: "Consulta iniciada",
        description: "Aguarde enquanto processamos a consulta...",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao iniciar consulta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reset = useCallback(() => {
    setCurrentJobId(null);
  }, []);

  return {
    consultarCnd: mutation.mutate,
    consultarCndAsync: mutation.mutateAsync,
    isStarting: mutation.isPending,
    isProcessing: isPolling,
    isLoading: mutation.isPending || isPolling,
    job,
    progress: job?.progress || 0,
    reset,
  };
};
