import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeCND(clientId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('cnd_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cnd_certidoes',
          filter: clientId ? `client_id=eq.${clientId}` : undefined
        },
        (payload) => {
          const novaCertidao = payload.new as any;
          
          toast({
            title: `✅ Nova Certidão: ${novaCertidao.tipo}`,
            description: `Status: ${novaCertidao.situacao || 'Processando'}`,
          });

          queryClient.invalidateQueries({ queryKey: ['cnd-certidoes'] });
          queryClient.invalidateQueries({ queryKey: ['cnd-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cnd_certidoes',
          filter: clientId ? `client_id=eq.${clientId}` : undefined
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['cnd-certidoes'] });
          queryClient.invalidateQueries({ queryKey: ['cnd-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, toast, queryClient]);
}
