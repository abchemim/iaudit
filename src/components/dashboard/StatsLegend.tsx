import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface StatsLegendProps {
  okCount: number;
  warningCount: number;
  dangerCount: number;
}

const StatsLegend = ({ okCount, warningCount, dangerCount }: StatsLegendProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-status-success/10 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-status-success" />
        </div>
        <span className="text-sm text-muted-foreground">Em dia</span>
        <span className="ml-auto text-sm font-semibold text-foreground">{okCount}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-status-warning/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-status-warning" />
        </div>
        <span className="text-sm text-muted-foreground">Pendências</span>
        <span className="ml-auto text-sm font-semibold text-foreground">{warningCount}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-status-danger/10 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-status-danger" />
        </div>
        <span className="text-sm text-muted-foreground">Atenção</span>
        <span className="ml-auto text-sm font-semibold text-foreground">{dangerCount}</span>
      </div>
    </div>
  );
};

export default StatsLegend;
