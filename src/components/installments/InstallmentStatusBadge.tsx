import { Badge } from "@/components/ui/badge";
import { InstallmentStatus } from "@/hooks/useInstallments";

interface InstallmentStatusBadgeProps {
  status: InstallmentStatus;
}

const statusConfig: Record<InstallmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ok: { label: "Em dia", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  attention: { label: "Atenção", variant: "outline" },
  expired: { label: "Atrasado", variant: "destructive" },
};

export const InstallmentStatusBadge = ({ status }: InstallmentStatusBadgeProps) => {
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
