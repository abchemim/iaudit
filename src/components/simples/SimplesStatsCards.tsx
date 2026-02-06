import { Card, CardContent } from "@/components/ui/card";
import { Receipt, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useSimplesStats } from "@/hooks/useSimplesLimits";
import { Skeleton } from "@/components/ui/skeleton";

export const SimplesStatsCards = () => {
  const { data: stats, isLoading } = useSimplesStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-4">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Clientes Monitorados",
      value: stats?.total || 0,
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Situação Normal",
      value: stats?.ok || 0,
      icon: CheckCircle,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      title: "Atenção (80%+)",
      value: stats?.attention || 0,
      icon: AlertTriangle,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      title: "Excedeu Limite",
      value: stats?.expired || 0,
      icon: XCircle,
      color: "text-status-danger",
      bgColor: "bg-status-danger/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {stats && stats.total > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Média de Utilização do Limite</p>
            <p className="text-2xl font-bold text-primary">{stats.avgPercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
