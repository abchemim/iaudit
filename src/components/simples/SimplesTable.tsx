import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplesStatusBadge } from "./SimplesStatusBadge";
import { SimplesLimit } from "@/hooks/useSimplesLimits";
import { Progress } from "@/components/ui/progress";

interface SimplesTableProps {
  limits?: SimplesLimit[];
  isLoading: boolean;
  search: string;
}

export const SimplesTable = ({
  limits,
  isLoading,
  search,
}: SimplesTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredLimits = limits?.filter((limit) => {
    const searchLower = search.toLowerCase();
    return (
      limit.clients?.company_name.toLowerCase().includes(searchLower) ||
      limit.clients?.cnpj.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredLimits?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Nenhum registro de sublimite encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Utilização</TableHead>
            <TableHead>Faturamento Acumulado</TableHead>
            <TableHead>Limite</TableHead>
            <TableHead>Saldo Disponível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLimits.map((limit) => {
            const percentage = limit.percentage_used || 0;
            const remaining = limit.limit_amount - limit.accumulated_revenue;
            
            return (
              <TableRow key={limit.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{limit.clients?.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {limit.clients?.cnpj}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{limit.year}</TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[120px]">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${
                        percentage >= 100 ? "[&>div]:bg-status-danger" :
                        percentage >= 80 ? "[&>div]:bg-status-warning" :
                        "[&>div]:bg-status-success"
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% utilizado
                    </p>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(limit.accumulated_revenue)}</TableCell>
                <TableCell>{formatCurrency(limit.limit_amount)}</TableCell>
                <TableCell className={remaining > 0 ? "text-status-success" : "text-status-danger"}>
                  {formatCurrency(remaining)}
                </TableCell>
                <TableCell>
                  <SimplesStatusBadge status={limit.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Atualizar Faturamento
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Limite
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
