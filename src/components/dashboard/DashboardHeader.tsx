import { Bell, Search, LogOut, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";
import { useCurrentUserProfile } from "@/hooks/useUserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardHeaderProps {
  activeTab: string;
}

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  declaracoes: "Declarações Fiscais",
  simples: "Sublimites do Simples Nacional",
  dctfweb: "DCTFWeb",
  fgts: "FGTS Digital",
  parcelamentos: "Parcelamentos",
  certidoes: "Certidões",
  caixaspostais: "Caixas Postais",
  usuarios: "Usuários",
  configuracoes: "Configurações",
  ajuda: "Ajuda",
};

const DashboardHeader = ({ activeTab }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile } = useCurrentUserProfile();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
    navigate("/");
  };

  const recentNotifications = notifications?.slice(0, 5) || [];

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-foreground">
          {tabTitles[activeTab] || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-64 pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-danger rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                  {unreadCount && unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-medium text-sm">Notificações</span>
              {(unreadCount ?? 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => markAllAsRead.mutate()}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <ScrollArea className="h-64">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nenhuma notificação
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead.mutate(notification.id);
                      }
                    }}
                  >
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <span className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-bold text-muted-foreground">
            ?
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden md:inline text-sm text-muted-foreground max-w-[150px] truncate">
                {profile?.name || user?.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-status-danger">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
