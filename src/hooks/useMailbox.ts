import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type MessageStatus = "unread" | "read";
export type MessagePriority = "low" | "medium" | "high";

export interface MailboxMessage {
  id: string;
  client_id: string;
  subject: string;
  source: string;
  message_date: string;
  status: MessageStatus;
  priority: MessagePriority;
  content: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    company_name: string;
    trade_name: string | null;
    cnpj: string;
  };
}

export interface MailboxFilters {
  status?: MessageStatus;
  priority?: MessagePriority;
  clientId?: string;
}

export const useMailboxMessages = (filters?: MailboxFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["mailbox-messages", filters],
    queryFn: async () => {
      let query = supabase
        .from("mailbox_messages")
        .select(`
          *,
          client:clients(id, company_name, trade_name, cnpj)
        `)
        .order("message_date", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.priority) {
        query = query.eq("priority", filters.priority);
      }
      if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MailboxMessage[];
    },
    enabled: !!user,
  });
};

export const useMailboxStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["mailbox-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mailbox_messages")
        .select("status, priority");

      if (error) throw error;

      const stats = {
        total: data.length,
        unread: data.filter((m) => m.status === "unread").length,
        highPriority: data.filter((m) => m.priority === "high").length,
      };

      return stats;
    },
    enabled: !!user,
  });
};

export const useUpdateMailboxMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MailboxMessage> & { id: string }) => {
      const { data, error } = await supabase
        .from("mailbox_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailbox-messages"] });
      queryClient.invalidateQueries({ queryKey: ["mailbox-stats"] });
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

export const useDeleteMailboxMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mailbox_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailbox-messages"] });
      queryClient.invalidateQueries({ queryKey: ["mailbox-stats"] });
      toast({
        title: "Mensagem removida",
        description: "A mensagem foi excluída com sucesso.",
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
