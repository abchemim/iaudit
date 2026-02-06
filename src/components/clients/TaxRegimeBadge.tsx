import { Badge } from "@/components/ui/badge";
import { TaxRegime } from "@/hooks/useClients";

interface TaxRegimeBadgeProps {
  regime: TaxRegime;
}

const regimeConfig: Record<TaxRegime, { label: string; className: string }> = {
  simples_nacional: {
    label: "Simples Nacional",
    className: "bg-status-ok/20 text-status-ok border-status-ok/30",
  },
  lucro_presumido: {
    label: "Lucro Presumido",
    className: "bg-status-warning/20 text-status-warning border-status-warning/30",
  },
  lucro_real: {
    label: "Lucro Real",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  mei: {
    label: "MEI",
    className: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  },
};

export const TaxRegimeBadge = ({ regime }: TaxRegimeBadgeProps) => {
  const config = regimeConfig[regime];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
