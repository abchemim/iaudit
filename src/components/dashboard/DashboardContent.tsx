import DonutChart from "./DonutChart";
import ProcessBar from "./ProcessBar";
import NotificationCard from "./NotificationCard";
import StatsLegend from "./StatsLegend";
import { ChevronRight, Building2, Users, ListTodo, CreditCard, AlertCircle } from "lucide-react";
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

const DashboardContent = () => {
  const { data: fgtsStats, isLoading: loadingFGTS } = useFGTSStats();
  const { data: certStats, isLoading: loadingCerts } = useCertificateStats();
  const { data: declStats, isLoading: loadingDecl } = useDeclarationStats();
  const { data: instStats, isLoading: loadingInst } = useInstallmentStats();
  const { data: simplesLimits, isLoading: loadingSimples } = useSimplesLimits({ year: new Date().getFullYear() });
  const { data: clients } = useClients();
  const { data: tarefasStats, isLoading: loadingTarefas } = useTarefasStats();
  const { data: creditosStats, isLoading: loadingCreditos } = useCreditosStats();

  const isLoading = loadingFGTS || loadingCerts || loadingDecl || loadingInst;

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
      ok: fgtsStats?.ok || 0, 
      warning: (fgtsStats?.pending || 0) + (fgtsStats?.attention || 0), 
      danger: fgtsStats?.expired || 0 
    },
    { 
      label: "Certidões", 
      ok: certStats?.ok || 0, 
      warning: (certStats?.pending || 0) + (certStats?.attention || 0), 
      danger: certStats?.expired || 0 
    },
    { 
      label: "Declarações", 
      ok: declStats?.ok || 0, 
      warning: (declStats?.pending || 0) + (declStats?.attention || 0), 
      danger: declStats?.expired || 0 
    },
    { 
      label: "Parcelamentos", 
      ok: instStats?.ok || 0, 
      warning: (instStats?.pending || 0) + (instStats?.attention || 0), 
      danger: instStats?.expired || 0 
    },
  ];

  // Get top 5 simples limits by percentage used
  const topSimplesLimits = simplesLimits?.slice(0, 5) || [];

  const absenceData = [
    { label: "Declarações pendentes", missing: declStats?.pending || 0, total: declStats?.total || 0 },
    { label: "Certidões vencidas", missing: certStats?.expired || 0, total: certStats?.total || 0 },
  ];

  const notifications: { company: string; message: string; type: "success" | "warning" | "danger" }[] = [
    ...(fgtsStats?.expired && fgtsStats.expired > 0 ? [{ company: "FGTS Digital", message: `${fgtsStats.expired} guia(s) vencida(s)`, type: "danger" as const }] : []),
    ...(certStats?.expired && certStats.expired > 0 ? [{ company: "Certidões", message: `${certStats.expired} certidão(ões) vencida(s)`, type: "danger" as const }] : []),
    ...(declStats?.attention && declStats.attention > 0 ? [{ company: "Declarações", message: `${declStats.attention} declaração(ões) com atenção`, type: "warning" as const }] : []),
    ...(instStats?.attention && instStats.attention > 0 ? [{ company: "Parcelamentos", message: `${instStats.attention} parcelamento(s) com atenção`, type: "warning" as const }] : []),
  ];

  if (notifications.length === 0) {
    notifications.push({ company: "Sistema", message: "Nenhuma pendência urgente", type: "success" });
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Pendências fiscais</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe seu monitoramento fiscal, tendo uma visão geral e uma visão por processo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Process Bars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Donut Chart */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Geral</h3>
                {isLoading ? (
                  <Skeleton className="w-40 h-40" />
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-40">
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

              {/* Process Bars */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Por processo</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
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
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sublimites do Simples */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-foreground">Sublimites do Simples</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe os sublimites dos seus clientes no Simples Nacional.
                </p>
              </div>
              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loadingSimples ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : topSimplesLimits.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topSimplesLimits.map((limit, i) => {
                  const percentage = limit.percentage_used || 0;
                  const color = percentage >= 100 ? "hsl(0, 84%, 60%)" : percentage >= 80 ? "hsl(38, 92%, 50%)" : "hsl(142, 71%, 45%)";
                  return (
                    <div key={limit.id} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2">
                        <DonutChart
                          data={[
                            { name: "Usado", value: Math.min(percentage, 100), color },
                            { name: "Livre", value: Math.max(100 - percentage, 0), color: "hsl(217, 33%, 17%)" },
                          ]}
                          centerValue={`${Math.round(percentage)}%`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {limit.clients?.company_name || `Cliente ${i + 1}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum sublimite cadastrado. Adicione clientes do Simples Nacional.
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Notifications and Absences */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-foreground">Notificações</h3>
                <p className="text-xs text-muted-foreground">
                  Confira as notificações do seu monitoramento fiscal.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <NotificationCard
                  key={index}
                  company={notification.company}
                  message={notification.message}
                  type={notification.type}
                />
              ))}
            </div>
          </div>

          {/* Absence of Declarations */}
          <div className="glass-card p-6">
            <div className="mb-4">
              <h3 className="text-base font-medium text-foreground">Resumo de Pendências</h3>
              <p className="text-xs text-muted-foreground">
                Monitore as pendências gerais do sistema.
              </p>
            </div>

            <div className="space-y-3">
              {absenceData.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-status-danger">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">{item.missing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{item.total}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-base font-medium text-foreground mb-4">Clientes Ativos</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{clients?.length || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">empresas cadastradas</p>
            </div>
          </div>

          {/* Tarefas Pendentes */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-primary" />
                <h3 className="text-base font-medium text-foreground">Tarefas Pendentes</h3>
              </div>
              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loadingTarefas ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pendentes</span>
                  <Badge variant="secondary" className="font-bold">{tarefasStats?.pendente || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Alta Prioridade</span>
                  <Badge variant="destructive" className="font-bold">{tarefasStats?.alta || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Em Andamento</span>
                  <Badge className="bg-status-warning text-white font-bold">{tarefasStats?.em_andamento || 0}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Créditos InfoSimples */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">Créditos InfoSimples</h3>
            </div>

            {loadingCreditos ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="space-y-3">
                {creditosStats?.saldoAtual !== null && (
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{creditosStats?.saldoAtual}</p>
                    <p className="text-xs text-muted-foreground">saldo disponível</p>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Últimos 30 dias</span>
                  <span className="font-medium">{creditosStats?.totalCreditos || 0} créditos</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Custo estimado</span>
                  <span className="font-medium">R$ {(creditosStats?.custoTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Taxa de sucesso</span>
                  <span className="font-medium text-status-ok">{(creditosStats?.taxaSucesso || 0).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
