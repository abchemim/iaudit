import DonutChart from "./DonutChart";
import ProcessBar from "./ProcessBar";
import NotificationCard from "./NotificationCard";
import StatsLegend from "./StatsLegend";
import { ChevronRight, Building2, Users } from "lucide-react";

// Mock data
const fiscalData = {
  ok: 36,
  pending: 48,
  attention: 4,
};

const processData = [
  { label: "PGDAS", ok: 80, warning: 15, danger: 5 },
  { label: "PGMEI", ok: 70, warning: 20, danger: 10 },
  { label: "DCTFWeb", ok: 60, warning: 30, danger: 10 },
  { label: "Parcelamento", ok: 50, warning: 35, danger: 15 },
  { label: "Certidões", ok: 75, warning: 15, danger: 10 },
  { label: "Caixas Postais", ok: 65, warning: 25, danger: 10 },
  { label: "Declarações", ok: 55, warning: 30, danger: 15 },
];

const notifications = [
  { company: "AUTO CENTER SA", message: "Pagamento detectado - DAS Simples", type: "success" as const },
  { company: "AUTO CENTER SA", message: "Pagamento detectado - DAS Simples", type: "success" as const },
  { company: "VERÍSSIMO ALVES LTDA", message: "Nova pendência - DCTFWeb", type: "danger" as const },
  { company: "TECH SOLUTIONS ME", message: "CND Federal expirando em 15 dias", type: "warning" as const },
];

const absenceData = [
  { label: "Declarações gerais", missing: 12, total: 123 },
  { label: "Declarações SPEDs", missing: 12, total: 123 },
];

const DashboardContent = () => {
  const chartData = [
    { name: "Em dia", value: fiscalData.ok, color: "hsl(142, 71%, 45%)" },
    { name: "Pendências", value: fiscalData.pending, color: "hsl(38, 92%, 50%)" },
    { name: "Atenção", value: fiscalData.attention, color: "hsl(0, 84%, 60%)" },
  ];

  const total = fiscalData.ok + fiscalData.pending + fiscalData.attention;

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
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
                    <DonutChart
                      data={chartData}
                      centerValue={total}
                      centerLabel="Total"
                    />
                  </div>
                  <StatsLegend
                    okCount={fiscalData.ok}
                    warningCount={fiscalData.pending}
                    dangerCount={fiscalData.attention}
                  />
                </div>
              </div>

              {/* Process Bars */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Por processo</h3>
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
              </div>
            </div>
          </div>

          {/* Sublimites do Simples */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-foreground">Sublimites do Simples</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe os sublimites R$112 dos seus 10 maiores clientes.
                </p>
              </div>
              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <DonutChart
                      data={[
                        { name: "Usado", value: 65 + i * 5, color: i > 3 ? "hsl(38, 92%, 50%)" : "hsl(142, 71%, 45%)" },
                        { name: "Livre", value: 35 - i * 5, color: "hsl(217, 33%, 17%)" },
                      ]}
                      centerValue={`${65 + i * 5}%`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Cliente {i}</p>
                </div>
              ))}
            </div>
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
              <h3 className="text-base font-medium text-foreground">Ausência de Declarações</h3>
              <p className="text-xs text-muted-foreground">
                Monitore as declarações e veja as ausências.
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
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
