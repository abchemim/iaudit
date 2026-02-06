import { Badge } from "@/components/ui/badge";
import { SimplesStatus } from "@/hooks/useSimplesLimits";

interface SimplesStatusBadgeProps {
  status: SimplesStatus;
}

const statusConfig: Record<SimplesStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ok: { label: "Normal", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  attention: { label: "Atenção (80%+)", variant: "outline" },
  expired: { label: "Excedeu Limite", variant: "destructive" },
};

export const SimplesStatusBadge = ({ status }: SimplesStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={
      status === "ok" ? "bg-status-success text-white" :
      status === "attention" ? "bg-status-warning text-white" :
      ""
    }>
      {config.label}
    </Badge>
  );
};
