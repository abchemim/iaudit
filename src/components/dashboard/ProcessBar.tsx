import { ChevronRight } from "lucide-react";

interface ProcessBarProps {
  label: string;
  okCount: number;
  warningCount: number;
  dangerCount: number;
  onClick?: () => void;
}

const ProcessBar = ({ label, okCount, warningCount, dangerCount, onClick }: ProcessBarProps) => {
  const total = okCount + warningCount + dangerCount;
  const okPercent = total > 0 ? (okCount / total) * 100 : 0;
  const warningPercent = total > 0 ? (warningCount / total) * 100 : 0;
  const dangerPercent = total > 0 ? (dangerCount / total) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
    >
      <span className="text-sm text-foreground font-medium min-w-[100px] text-left">
        {label}
      </span>
      
      <div className="flex-1 h-6 rounded-md overflow-hidden flex">
        {okPercent > 0 && (
          <div
            className="h-full bg-status-success"
            style={{ width: `${okPercent}%` }}
          />
        )}
        {warningPercent > 0 && (
          <div
            className="h-full bg-status-warning"
            style={{ width: `${warningPercent}%` }}
          />
        )}
        {dangerPercent > 0 && (
          <div
            className="h-full bg-status-danger"
            style={{ width: `${dangerPercent}%` }}
          />
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
};

export default ProcessBar;
