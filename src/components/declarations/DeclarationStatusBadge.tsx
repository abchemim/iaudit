import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { DeclarationStatus } from "@/hooks/useDeclarations";

interface DeclarationStatusBadgeProps {
  status: DeclarationStatus;
}

const statusConfig: Record<DeclarationStatus, { label: string; className: string; icon: React.ReactNode }> = {
  ok: {
    label: "Entregue",
    className: "bg-status-ok/20 text-status-ok border-status-ok/30",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  pending: {
    label: "Pendente",
    className: "bg-status-warning/20 text-status-warning border-status-warning/30",
    icon: <Clock className="w-3 h-3" />,
  },
  attention: {
    label: "Atenção",
    className: "bg-status-danger/20 text-status-danger border-status-danger/30",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  expired: {
    label: "Atrasada",
    className: "bg-muted text-muted-foreground border-muted",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export const DeclarationStatusBadge = ({ status }: DeclarationStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
