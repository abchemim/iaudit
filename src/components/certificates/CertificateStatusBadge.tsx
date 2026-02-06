import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { CertificateStatus } from "@/hooks/useCertificates";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
}

const statusConfig: Record<CertificateStatus, { label: string; className: string; icon: React.ReactNode }> = {
  ok: {
    label: "Regular",
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
    label: "Vencida",
    className: "bg-muted text-muted-foreground border-muted",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export const CertificateStatusBadge = ({ status }: CertificateStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
