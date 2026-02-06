import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileCheck } from "lucide-react";
import { useCertificateStats } from "@/hooks/useCertificates";

export const CertificateStatsCards = () => {
  const { data: stats, isLoading } = useCertificateStats();

  const cards = [
    {
      label: "Total de Certidões",
      value: stats?.total || 0,
      icon: FileCheck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Regulares",
      value: stats?.ok || 0,
      icon: CheckCircle2,
      color: "text-status-ok",
      bgColor: "bg-status-ok/10",
    },
    {
      label: "Pendentes",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Com Pendências",
      value: stats?.attention || 0,
      icon: AlertTriangle,
      color: "text-status-danger",
      bgColor: "bg-status-danger/10",
    },
    {
      label: "Vencidas",
      value: stats?.expired || 0,
      icon: XCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4 glass-card">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-8" />
              ) : (
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
