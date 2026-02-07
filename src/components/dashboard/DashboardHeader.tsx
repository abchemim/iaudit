import {
  Bell,
  Search,
  LogOut,
  User,
  Check,
  Loader2,
  Building2,
  ClipboardList,
  X,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";
import { useCurrentUserProfile, useUpdateUserProfile, ROLE_LABELS, UserRole } from "@/hooks/useUserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
interface SearchResult {
  id: string;
  type: "client" | "tarefa" | "declaracao" | "certidao";
  title: string;
  subtitle: string;
}
interface DashboardHeaderProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
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
  tarefas: "Tarefas",
  usuarios: "Usuários",
  configuracoes: "Configurações",
  ajuda: "Ajuda",
};
const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile } = useCurrentUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["global-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const results: SearchResult[] = [];

      // Search clients
      const { data: clients } = await supabase
        .from("clients")
        .select("id, company_name, trade_name, cnpj")
        .or(`company_name.ilike.%${searchQuery}%,trade_name.ilike.%${searchQuery}%,cnpj.ilike.%${searchQuery}%`)
        .limit(4);
      if (clients) {
        clients.forEach((client) => {
          results.push({
            id: client.id,
            type: "client",
            title: client.trade_name || client.company_name,
            subtitle: client.cnpj,
          });
        });
      }

      // Search tasks
      const { data: tarefas } = await supabase
        .from("tarefas")
        .select("id, titulo, descricao")
        .or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`)
        .limit(3);
      if (tarefas) {
        tarefas.forEach((tarefa) => {
          results.push({
            id: tarefa.id,
            type: "tarefa",
            title: tarefa.titulo,
            subtitle: tarefa.descricao || "Sem descrição",
          });
        });
      }

      // Search tax declarations
      const { data: declarations } = await supabase
        .from("tax_declarations")
        .select("id, type, competence_month, status, clients(company_name, trade_name)")
        .limit(3);
      if (declarations) {
        const declarationTypes: Record<string, string> = {
          pgdas: "PGDAS-D",
          pgmei: "PGMEI",
          dctfweb: "DCTFWeb",
          sped_fiscal: "SPED Fiscal",
          sped_contabil: "SPED Contábil",
          ecd: "ECD",
          ecf: "ECF",
        };
        declarations.forEach((decl) => {
          const clientName = decl.clients?.trade_name || decl.clients?.company_name || "Cliente";
          const competence = new Date(decl.competence_month).toLocaleDateString("pt-BR", {
            month: "short",
            year: "numeric",
          });
          const typeName = declarationTypes[decl.type] || decl.type;

          // Filter by search query on type or client name
          if (
            typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clientName.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            results.push({
              id: decl.id,
              type: "declaracao",
              title: `${typeName} - ${competence}`,
              subtitle: clientName,
            });
          }
        });
      }

      // Search certificates (CND)
      const { data: certidoes } = await supabase
        .from("cnd_certidoes")
        .select("id, tipo, orgao, status, situacao, clients(company_name, trade_name)")
        .limit(3);
      if (certidoes) {
        const orgaoLabels: Record<string, string> = {
          receita_federal: "Receita Federal",
          pgfn: "PGFN",
          tst: "TST",
          fgts: "FGTS/CEF",
          estadual: "Estadual",
          municipal: "Municipal",
        };
        certidoes.forEach((cert) => {
          const clientName = cert.clients?.trade_name || cert.clients?.company_name || "Cliente";
          const orgaoName = orgaoLabels[cert.orgao] || cert.orgao;

          // Filter by search query on tipo, orgao or client name
          if (
            cert.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orgaoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            "cnd".includes(searchQuery.toLowerCase()) ||
            "certidão".includes(searchQuery.toLowerCase()) ||
            "certidao".includes(searchQuery.toLowerCase())
          ) {
            results.push({
              id: cert.id,
              type: "certidao",
              title: `${cert.tipo} - ${orgaoName}`,
              subtitle: clientName,
            });
          }
        });
      }
      return results;
    },
    enabled: searchQuery.length >= 2,
    staleTime: 1000,
  });
  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery("");
    setShowResults(false);
    if (result.type === "client") {
      onTabChange?.("clientes");
    } else if (result.type === "tarefa") {
      onTabChange?.("tarefas");
    } else if (result.type === "declaracao") {
      onTabChange?.("declaracoes");
    } else if (result.type === "certidao") {
      onTabChange?.("certidoes");
    }
  };
  const openProfileDialog = () => {
    setProfileName(profile?.name || "");
    setProfilePhone(profile?.phone || "");
    setProfileDialogOpen(true);
  };
  const handleSaveProfile = () => {
    updateProfile.mutate(
      {
        name: profileName,
        phone: profilePhone,
      },
      {
        onSuccess: () => {
          setProfileDialogOpen(false);
        },
      },
    );
  };
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
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-foreground">{tabTitles[activeTab] || "Dashboard"}</h1>
        </div>

        <div className="flex items-center gap-4 mx-0 px-0 pl-[240px] ml-0">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <input
              type="text"
              placeholder="Buscar clientes, tarefas, declarações, certidões..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-72 pl-10 pr-8 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchQuery.length >= 2 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[200%] min-w-[300px] bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando...
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <ScrollArea className="max-h-64">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors text-left border-b border-border last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {result.type === "client" ? (
                            <Building2 className="w-4 h-4 text-primary" />
                          ) : result.type === "tarefa" ? (
                            <ClipboardList className="w-4 h-4 text-primary" />
                          ) : result.type === "declaracao" ? (
                            <FileText className="w-4 h-4 text-primary" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {result.type === "client"
                            ? "Cliente"
                            : result.type === "tarefa"
                              ? "Tarefa"
                              : result.type === "declaracao"
                                ? "Declaração"
                                : "Certidão"}
                        </span>
                      </button>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">Nenhum resultado encontrado</div>
                )}
              </div>
            )}
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
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAllAsRead.mutate()}>
                    <Check className="w-3 h-3 mr-1" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <ScrollArea className="h-64">
                {recentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">Nenhuma notificação</div>
                ) : (
                  recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.is_read ? "bg-primary/5" : ""}`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead.mutate(notification.id);
                        }
                      }}
                    >
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem onClick={openProfileDialog}>
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

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Meu Perfil</DialogTitle>
            <DialogDescription>Visualize e edite suas informações pessoais</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">E-mail</Label>
              <Input id="profile-email" value={profile?.email || user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefone</Label>
              <Input
                id="profile-phone"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <Input
                value={profile?.role ? ROLE_LABELS[profile.role as UserRole] : "Contador"}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">A função é definida pelo administrador</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DashboardHeader;
