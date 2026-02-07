import DonutChart from "./DonutChart";
import ProcessBar from "./ProcessBar";
import NotificationCard from "./NotificationCard";
import StatsLegend from "./StatsLegend";
import { ChevronRight, Building2, Users, ListTodo, CreditCard, FileWarning } from "lucide-react";
import { useFGTSStats } from "@/hooks/useFGTSRecords";
import { useCertificateStats } from "@/hooks/useCertificates";
import { useDeclarationStats } from "@/hooks/useDeclarations";
import { useInstallmentStats } from "@/hooks/useInstallments";
import { useSimplesLimits } from "@/hooks/useSimplesLimits";
import { useClients } from "@/hooks/useClients";
import { useTarefasStats } from "@/hooks/useTarefas";
import { useCreditosStats } from "@/hooks/useCreditosInfosimples";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardContentProps {
  onNavigate?: (tab: string) => void;
}

const DashboardContent = ({ onNavigate }: DashboardContentProps) => {
  const { data: fgtsStats, isLoading: loadingFGTS } = useFGTSStats();
  const { data: certStats, isLoading: loadingCerts } = useCertificateStats();
  const { data: declStats, isLoading: loadingDecl } = useDeclarationStats();
  const { data: instStats, isLoading: loadingInst } = useInstallmentStats();
  const { data: simplesLimits, isLoading: loadingSimples } = useSimplesLimits({ year: new Date().getFullYear() });
  const { data: clients } = useClients();
  const { data: tarefasStats, isLoading: loadingTarefas } = useTarefasStats();
  const { data: creditosStats, isLoading: loadingCreditos } = useCreditosStats();

  const isLoading = loadingFGTS || loadingCerts || loadingDecl || loadingInst;

  // Navigation handler
  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  // Aggregate stats
  const totalOk = (fgtsStats?.ok || 0) + (certStats?.ok || 0) + (declStats?.ok || 0) + (instStats?.ok || 0);
  const totalPending = (fgtsStats?.pending || 0) + (certStats?.pending || 0) + (declStats?.pending || 0) + (instStats?.pending || 0);
  const totalAttention = (fgtsStats?.attention || 0) + (certStats?.attention || 0) + (declStats?.attention || 0) + (instStats?.attention || 0);
  const totalExpired = (fgtsStats?.expired || 0) + (certStats?.expired || 0) + (declStats?.expired || 0) + (instStats?.expired || 0);

  const chartData = [
    { name: "Em dia", value: totalOk, color: "hsl(142, 71%, 45%)" },
    { name: "Pendências", value: totalPending + totalAttention, color: "hsl(38, 92%, 50%)" },
    { name: "Vencidos", value: totalExpired, color: "hsl(0, 84%, 60%)" },
  ];

  const total = totalOk + totalPending + totalAttention + totalExpired;

  const processData = [
    { 
      label: "FGTS Digital", 
      tab: "fgts",
      ok: fgtsStats?.ok || 0, 
      warning: (fgtsStats?.pending || 0) + (fgtsStats?.attention || 0), 
      danger: fgtsStats?.expired || 0 
    },
    { 
      label: "Certidões", 
      tab: "certidoes",
      ok: certStats?.ok || 0, 
      warning: (certStats?.pending || 0) + (certStats?.attention || 0), 
      danger: certStats?.expired || 0 
    },
    { 
      label: "Declarações", 
      tab: "declaracoes",
      ok: declStats?.ok || 0, 
      warning: (declStats?.pending || 0) + (declStats?.attention || 0), 
      danger: declStats?.expired || 0 
    },
    { 
      label: "Parcelamentos", 
      tab: "parcelamentos",
      ok: instStats?.ok || 0, 
      warning: (instStats?.pending || 0) + (instStats?.attention || 0), 
      danger: instStats?.expired || 0 
    },
  ];

  // Get top 5 simples limits by percentage used
  const topSimplesLimits = simplesLimits?.slice(0, 5) || [];

  const absenceData = [
    { label: "Declarações pendentes", tab: "declaracoes", missing: declStats?.pending || 0, total: declStats?.total || 0 },
    { label: "Certidões vencidas", tab: "certidoes", missing: certStats?.expired || 0, total: certStats?.total || 0 },
  ];

  // Map notification types to tabs
  const getNotificationTab = (company: string): string => {
    switch (company) {
      case "FGTS Digital": return "fgts";
      case "Certidões": return "certidoes";
      case "Declarações": return "declaracoes";
      case "Parcelamentos": return "parcelamentos";
      default: return "dashboard";
    }
  };

  const notifications: { company: string; message: string; type: "success" | "warning" | "danger"; tab: string }[] = [
    ...(fgtsStats?.expired && fgtsStats.expired > 0 ? [{ company: "FGTS Digital", message: `${fgtsStats.expired} guia(s) vencida(s)`, type: "danger" as const, tab: "fgts" }] : []),
    ...(certStats?.expired && certStats.expired > 0 ? [{ company: "Certidões", message: `${certStats.expired} certidão(ões) vencida(s)`, type: "danger" as const, tab: "certidoes" }] : []),
    ...(declStats?.attention && declStats.attention > 0 ? [{ company: "Declarações", message: `${declStats.attention} declaração(ões) com atenção`, type: "warning" as const, tab: "declaracoes" }] : []),
    ...(instStats?.attention && instStats.attention > 0 ? [{ company: "Parcelamentos", message: `${instStats.attention} parcelamento(s) com atenção`, type: "warning" as const, tab: "parcelamentos" }] : []),
  ];

  if (notifications.length === 0) {
    notifications.push({ company: "Sistema", message: "Nenhuma pendência urgente", type: "success", tab: "dashboard" });
  }

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Pendências fiscais</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Acompanhe seu monitoramento fiscal, tendo uma visão geral e uma visão por processo.
          </p>
        </div>

        {/* Main Grid Layout - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
          
          {/* Left/Main Column */}
          <div className="xl:col-span-8 space-y-4 md:space-y-6">
            
            {/* Overview Card */}
            <Card className="glass-card p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Donut Chart Section */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Geral</h3>
                  {isLoading ? (
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                        <DonutChart
                          data={chartData}
                          centerValue={total}
                          centerLabel="Total"
                        />
                      </div>
                      <StatsLegend
                        okCount={totalOk}
                        warningCount={totalPending + totalAttention}
                        dangerCount={totalExpired}
                      />
                    </div>
                  )}
                </div>

                {/* Process Bars Section */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Por processo</h3>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {processData.map((process) => (
                        <ProcessBar
                          key={process.label}
                          label={process.label}
                          okCount={process.ok}
                          warningCount={process.warning}
                          dangerCount={process.danger}
                          onClick={() => handleNavigate(process.tab)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Sublimites do Simples */}
            <Card className="glass-card p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-medium text-foreground">Sublimites do Simples</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Acompanhe os sublimites dos seus clientes no Simples Nacional.
                  </p>
                </div>
                <button 
                  onClick={() => handleNavigate("simples")}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:underline self-start sm:self-center"
                >
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {loadingSimples ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : topSimplesLimits.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {topSimplesLimits.map((limit, i) => {
                    const percentage = limit.percentage_used || 0;
                    const color = percentage >= 100 ? "hsl(0, 84%, 60%)" : percentage >= 80 ? "hsl(38, 92%, 50%)" : "hsl(142, 71%, 45%)";
                    return (
                      <button
                        key={limit.id} 
                        onClick={() => handleNavigate("simples")}
                        className="text-center p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer"
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2">
                          <DonutChart
                            data={[
                              { name: "Usado", value: Math.min(percentage, 100), color },
                              { name: "Livre", value: Math.max(100 - percentage, 0), color: "hsl(217, 33%, 17%)" },
                            ]}
                            centerValue={`${Math.round(percentage)}%`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground truncate px-1">
                          {limit.clients?.company_name || `Cliente ${i + 1}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileWarning className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum sublimite cadastrado.</p>
                  <p className="text-xs">Adicione clientes do Simples Nacional.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right/Sidebar Column */}
          <div className="xl:col-span-4 space-y-4 md:space-y-6">
            
            {/* Notifications */}
            <Card className="glass-card p-4 md:p-5">
              <div className="mb-3">
                <h3 className="text-base font-medium text-foreground">Notificações</h3>
                <p className="text-xs text-muted-foreground">
                  Confira as notificações do seu monitoramento fiscal.
                </p>
              </div>
              <div className="space-y-2">
                {notifications.map((notification, index) => (
                  <NotificationCard
                    key={index}
                    company={notification.company}
                    message={notification.message}
                    type={notification.type}
                    onClick={() => handleNavigate(notification.tab)}
                  />
                ))}
              </div>
            </Card>

            {/* Absence of Declarations */}
            <Card className="glass-card p-4 md:p-5">
              <div className="mb-3">
                <h3 className="text-base font-medium text-foreground">Resumo de Pendências</h3>
                <p className="text-xs text-muted-foreground">
                  Monitore as pendências gerais do sistema.
                </p>
              </div>
              <div className="space-y-2">
                {absenceData.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.tab)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-status-danger">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">{item.missing}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{item.total}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Active Clients */}
              <Card 
                className="glass-card p-4 text-center cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => handleNavigate("clientes")}
              >
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Clientes Ativos</h3>
                <p className="text-2xl md:text-3xl font-bold text-primary">{clients?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">empresas</p>
              </Card>

              {/* Tarefas Pendentes Summary */}
              <Card className="glass-card p-4 text-center">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Tarefas</h3>
                {loadingTarefas ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  <>
                    <p className="text-2xl md:text-3xl font-bold text-status-warning">
                      {tarefasStats?.pendente || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">pendentes</p>
                  </>
                )}
              </Card>
            </div>

            {/* Tarefas Pendentes Detail */}
            <Card className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-foreground">Tarefas Pendentes</h3>
                </div>
                <button 
                  onClick={() => handleNavigate("configuracoes")}
                  className="text-primary text-xs font-medium flex items-center gap-1 hover:underline"
                >
                  Ver todas
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loadingTarefas ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-muted-foreground">Pendentes</span>
                    <Badge variant="secondary" className="font-bold text-xs h-5 px-2">
                      {tarefasStats?.pendente || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-muted-foreground">Alta Prioridade</span>
                    <Badge variant="destructive" className="font-bold text-xs h-5 px-2">
                      {tarefasStats?.alta || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-muted-foreground">Em Andamento</span>
                    <Badge className="bg-status-warning text-white font-bold text-xs h-5 px-2">
                      {tarefasStats?.em_andamento || 0}
                    </Badge>
                  </div>
                </div>
              )}
            </Card>

            {/* Créditos InfoSimples */}
            <Card className="glass-card p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Créditos InfoSimples</h3>
              </div>

              {loadingCreditos ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <div className="space-y-2">
                  {creditosStats?.saldoAtual !== null && (
                    <div className="text-center p-3 bg-secondary/30 rounded-lg mb-3">
                      <p className="text-xl font-bold text-primary">{creditosStats?.saldoAtual}</p>
                      <p className="text-xs text-muted-foreground">saldo disponível</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">Últimos 30 dias</span>
                    <span className="font-medium">{creditosStats?.totalCreditos || 0} créditos</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">Custo estimado</span>
                    <span className="font-medium">R$ {(creditosStats?.custoTotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-muted-foreground">Taxa de sucesso</span>
                    <span className="font-medium text-status-success">{(creditosStats?.taxaSucesso || 0).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DashboardContent;