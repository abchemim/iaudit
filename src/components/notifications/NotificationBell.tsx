import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function NotificationBell() {
  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
      
      return count || 0;
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('notification_updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  );
}
