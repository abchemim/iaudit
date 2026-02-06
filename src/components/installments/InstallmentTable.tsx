import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { Installment, useDeleteInstallment, useUpdateInstallment } from "@/hooks/useInstallments";
import { Progress } from "@/components/ui/progress";

interface InstallmentTableProps {
  installments?: Installment[];
  isLoading: boolean;
  search: string;
}

export const InstallmentTable = ({
  installments,
  isLoading,
  search,
}: InstallmentTableProps) => {
  const deleteInstallment = useDeleteInstallment();
  const updateInstallment = useUpdateInstallment();

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  };

  const filteredInstallments = installments?.filter((installment) => {
    const searchLower = search.toLowerCase();
    return (
      installment.program_name.toLowerCase().includes(searchLower) ||
      installment.clients?.company_name.toLowerCase().includes(searchLower)
    );
  });

  const handlePayInstallment = (installment: Installment) => {
    const newCurrent = (installment.current_installment || 0) + 1;
    const newPaid = (installment.paid_amount || 0) + (installment.monthly_amount || 0);
    
    updateInstallment.mutate({
      id: installment.id,
      current_installment: newCurrent,
      paid_amount: newPaid,
      status: newCurrent >= installment.installment_count ? "ok" : installment.status,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredInstallments?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Nenhum parcelamento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Programa</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Valor Pago</TableHead>
            <TableHead>Próx. Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInstallments.map((installment) => {
            const progress = installment.installment_count > 0
              ? ((installment.current_installment || 0) / installment.installment_count) * 100
              : 0;
            
            return (
              <TableRow key={installment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{installment.clients?.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {installment.clients?.cnpj}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{installment.program_name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2 w-24" />
                    <p className="text-xs text-muted-foreground">
                      {installment.current_installment || 0}/{installment.installment_count} parcelas
                    </p>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(installment.total_amount)}</TableCell>
                <TableCell className="text-status-success">
                  {formatCurrency(installment.paid_amount)}
                </TableCell>
                <TableCell>{formatDate(installment.next_due_date)}</TableCell>
                <TableCell>
                  <InstallmentStatusBadge status={installment.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handlePayInstallment(installment)}
                        disabled={(installment.current_installment || 0) >= installment.installment_count}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Registrar Pagamento
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteInstallment.mutate(installment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
