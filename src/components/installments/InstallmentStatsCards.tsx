import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { useInstallmentStats } from "@/hooks/useInstallments";
import { Skeleton } from "@/components/ui/skeleton";

export const InstallmentStatsCards = () => {
  const { data: stats, isLoading } = useInstallmentStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
      title: "Total",
      value: stats?.total || 0,
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Em dia",
      value: stats?.ok || 0,
      icon: CheckCircle,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      title: "Pendentes",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    {
      title: "Atenção",
      value: stats?.attention || 0,
      icon: AlertTriangle,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      title: "Atrasados",
      value: stats?.expired || 0,
      icon: XCircle,
      color: "text-status-danger",
      bgColor: "bg-status-danger/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Valor Total dos Parcelamentos</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalValue)}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Valor Total Pago</p>
              <p className="text-2xl font-bold text-status-success">{formatCurrency(stats.paidValue)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
