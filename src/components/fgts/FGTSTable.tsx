import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FGTSStatusBadge from "./FGTSStatusBadge";
import { useFGTSRecords, useUpdateFGTSRecord, useDeleteFGTSRecord, type FGTSFilters } from "@/hooks/useFGTSRecords";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FGTSTableProps {
  filters: FGTSFilters;
}

const formatCurrency = (value: number | null) => {
  if (value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatCompetence = (date: string) => {
  return format(parseISO(date), "MMMM/yyyy", { locale: ptBR });
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return format(parseISO(date), "dd/MM/yyyy");
};

const FGTSTable = ({ filters }: FGTSTableProps) => {
  const { data: records, isLoading } = useFGTSRecords(filters);
  const updateRecord = useUpdateFGTSRecord();
  const deleteRecord = useDeleteFGTSRecord();

  const handleMarkAsPaid = (id: string) => {
    updateRecord.mutate({
      id,
      status: "ok",
      paid_at: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta guia?")) {
      deleteRecord.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Nenhuma guia FGTS encontrada.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastre clientes e adicione guias para começar o monitoramento.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Empresa</TableHead>
            <TableHead className="text-muted-foreground">Competência</TableHead>
            <TableHead className="text-muted-foreground">Vencimento</TableHead>
            <TableHead className="text-muted-foreground">Valor</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Pago em</TableHead>
            <TableHead className="text-muted-foreground w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="border-border">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">
                    {record.client?.trade_name || record.client?.company_name || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {record.client?.cnpj || "—"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-foreground capitalize">
                {formatCompetence(record.competence_month)}
              </TableCell>
              <TableCell className="text-foreground">
                {formatDate(record.due_date)}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {formatCurrency(record.amount)}
              </TableCell>
              <TableCell>
                <FGTSStatusBadge status={record.status} />
              </TableCell>
              <TableCell className="text-foreground">
                {formatDate(record.paid_at)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalhes
                    </DropdownMenuItem>
                    {record.status !== "ok" && (
                      <DropdownMenuItem onClick={() => handleMarkAsPaid(record.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como pago
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-status-danger"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FGTSTable;
