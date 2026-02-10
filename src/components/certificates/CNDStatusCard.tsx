import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface CNDStatusCardProps {
  tipo: 'federal' | 'estadual' | 'fgts';
  situacao?: 'regular' | 'irregular' | 'pendente';
  dataValidade?: string;
  possuiDebitos?: boolean;
}

export function CNDStatusCard({ 
  tipo, 
  situacao, 
  dataValidade,
  possuiDebitos 
}: CNDStatusCardProps) {
  const getIcon = () => {
    if (situacao === 'regular') return <CheckCircle className="w-5 h-5 text-status-success" />;
    if (situacao === 'irregular') return <AlertCircle className="w-5 h-5 text-destructive" />;
    return <Clock className="w-5 h-5 text-status-warning" />;
  };

  const getLabel = () => {
    if (tipo === 'federal') return 'CND Federal';
    if (tipo === 'estadual') return 'CND Estadual';
    return 'CRF FGTS';
  };

  const getBadgeVariant = () => {
    if (situacao === 'regular') return 'default';
    if (situacao === 'irregular') return 'destructive';
    return 'secondary';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-medium text-sm">{getLabel()}</span>
        </div>
        <Badge variant={getBadgeVariant()}>
          {situacao?.toUpperCase() || 'N/A'}
        </Badge>
      </div>

      {dataValidade && (
        <p className="text-xs text-muted-foreground mt-2">
          Válida até: {new Date(dataValidade).toLocaleDateString('pt-BR')}
        </p>
      )}
      
      {possuiDebitos && (
        <p className="text-xs text-destructive mt-1">
          ⚠️ Possui débitos
        </p>
      )}
    </Card>
  );
}
