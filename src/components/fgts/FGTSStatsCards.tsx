import { useFGTSStats } from "@/hooks/useFGTSRecords";
import { CheckCircle2, Clock, AlertTriangle, FileCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FGTSStatsCards = () => {
  const { data: stats, isLoading } = useFGTSStats();

  const cards = [
    {
      label: "Total de Guias",
      value: stats?.total ?? 0,
      icon: FileCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pagas",
      value: stats?.ok ?? 0,
      icon: CheckCircle2,
      color: "text-status-success",
      bg: "bg-status-success/10",
    },
    {
      label: "Pendentes",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-status-warning",
      bg: "bg-status-warning/10",
    },
    {
      label: "Vencidas/Atenção",
      value: (stats?.attention ?? 0) + (stats?.expired ?? 0),
      icon: AlertTriangle,
      color: "text-status-danger",
      bg: "bg-status-danger/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass-card p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl ${card.bg}`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FGTSStatsCards;
