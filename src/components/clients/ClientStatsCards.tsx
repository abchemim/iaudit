import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, CheckCircle2, FileText, Briefcase } from "lucide-react";
import { Client, TaxRegime } from "@/hooks/useClients";

interface ClientStatsCardsProps {
  clients: Client[] | undefined;
  isLoading: boolean;
}

const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

export const ClientStatsCards = ({ clients, isLoading }: ClientStatsCardsProps) => {
  const stats = {
    total: clients?.length || 0,
    simples: clients?.filter((c) => c.tax_regime === "simples_nacional").length || 0,
    lucroPresumido: clients?.filter((c) => c.tax_regime === "lucro_presumido").length || 0,
    mei: clients?.filter((c) => c.tax_regime === "mei").length || 0,
  };

  const cards = [
    {
      label: "Total de Clientes",
      value: stats.total,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Simples Nacional",
      value: stats.simples,
      icon: CheckCircle2,
      color: "text-status-ok",
      bgColor: "bg-status-ok/10",
    },
    {
      label: "Lucro Presumido",
      value: stats.lucroPresumido,
      icon: FileText,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "MEI",
      value: stats.mei,
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
