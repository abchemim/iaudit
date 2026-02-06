import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { FGTSStatus } from "@/hooks/useFGTSRecords";

interface FGTSStatusBadgeProps {
  status: FGTSStatus;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<FGTSStatus, { label: string; icon: React.ElementType; className: string }> = {
  ok: {
    label: "Pago",
    icon: CheckCircle2,
    className: "status-success",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "status-warning",
  },
  attention: {
    label: "Atenção",
    icon: AlertTriangle,
    className: "status-danger",
  },
  expired: {
    label: "Vencido",
    icon: XCircle,
    className: "status-danger",
  },
};

const FGTSStatusBadge = ({ status, showLabel = true, size = "md" }: FGTSStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span
      className={cn(
        "status-badge",
        config.className,
        size === "sm" && "px-2 py-0.5 text-[10px]"
      )}
    >
      <Icon className={cn("flex-shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default FGTSStatusBadge;
