import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FGTSRecord } from "@/hooks/useFGTSRecords";
import FGTSStatusBadge from "./FGTSStatusBadge";

interface FGTSViewDialogProps {
  record: FGTSRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (value: number | null) => {
  if (value === null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return format(parseISO(date), "dd/MM/yyyy");
};

const formatCompetence = (date: string) => {
  return format(parseISO(date), "MMMM 'de' yyyy", { locale: ptBR });
};

export const FGTSViewDialog = ({ record, open, onOpenChange }: FGTSViewDialogProps) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Guia FGTS</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Cliente */}
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Empresa</p>
            <p className="font-medium">
              {record.client?.trade_name || record.client?.company_name || "—"}
            </p>
            <p className="text-sm text-muted-foreground">{record.client?.cnpj}</p>
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Competência</p>
              <p className="font-medium capitalize">{formatCompetence(record.competence_month)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vencimento</p>
              <p className="font-medium">{formatDate(record.due_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="font-medium">{formatCurrency(record.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <FGTSStatusBadge status={record.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Pago</p>
              <p className="font-medium text-status-success">{formatCurrency(record.paid_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Pagamento</p>
              <p className="font-medium">{formatDate(record.paid_at)}</p>
            </div>
          </div>

          {/* Número da guia */}
          {record.guide_number && (
            <div>
              <p className="text-sm text-muted-foreground">Número da Guia</p>
              <p className="font-mono">{record.guide_number}</p>
            </div>
          )}

          {/* Observações */}
          {record.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Observações</p>
              <p className="text-sm">{record.notes}</p>
            </div>
          )}

          {/* Datas de criação/atualização */}
          <div className="pt-4 border-t border-border text-xs text-muted-foreground">
            <p>Criado em: {formatDate(record.created_at)}</p>
            <p>Atualizado em: {formatDate(record.updated_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
