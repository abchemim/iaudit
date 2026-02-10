import { useState } from 'react';
import { n8nService } from '@/services/n8nService';
import { useToast } from '@/hooks/use-toast';

export function useConsultaCND() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const consultarCNDs = async (clientId: string, tipos?: string[]) => {
    setIsLoading(true);
    
    try {
      const result = await n8nService.consultarCNDs({
        client_id: clientId,
        tipos: tipos as any
      });

      toast({
        title: "✅ Consulta Iniciada",
        description: "As certidões estão sendo consultadas. Você receberá notificação quando concluir.",
      });

      return result;
    } catch (error) {
      toast({
        title: "❌ Erro na Consulta",
        description: "Não foi possível iniciar a consulta. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    consultarCNDs,
    isLoading
  };
}
