import { ChevronRight, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface NotificationCardProps {
  company: string;
  message: string;
  type: "success" | "warning" | "danger";
  onClick?: () => void;
}

const NotificationCard = ({ company, message, type, onClick }: NotificationCardProps) => {
  const config = {
    success: { icon: CheckCircle, dotColor: "bg-status-success" },
    warning: { icon: AlertTriangle, dotColor: "bg-status-warning" },
    danger: { icon: AlertCircle, dotColor: "bg-status-danger" },
  }[type];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group text-left"
    >
      <div className={`w-2 h-2 rounded-full mt-2 ${config.dotColor}`} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{company}</p>
        <p className="text-xs text-muted-foreground truncate">{message}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
    </button>
  );
};

export default NotificationCard;
