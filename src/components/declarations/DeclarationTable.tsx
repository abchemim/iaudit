import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeclarationStatusBadge } from "./DeclarationStatusBadge";
import {
  TaxDeclaration,
  DECLARATION_TYPE_LABELS,
  useUpdateDeclaration,
  useDeleteDeclaration,
} from "@/hooks/useDeclarations";

interface DeclarationTableProps {
  declarations: TaxDeclaration[] | undefined;
  isLoading: boolean;
  search: string;
}

export const DeclarationTable = ({
  declarations,
  isLoading,
  search,
}: DeclarationTableProps) => {
  const updateDeclaration = useUpdateDeclaration();
  const deleteDeclaration = useDeleteDeclaration();

  const filteredDeclarations = declarations?.filter((dec) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      dec.client?.company_name.toLowerCase().includes(searchLower) ||
      dec.client?.trade_name?.toLowerCase().includes(searchLower) ||
      dec.client?.cnpj.includes(search)
    );
  });

  const handleMarkAsDelivered = (id: string) => {
    updateDeclaration.mutate({
      id,
      status: "ok",
      submitted_at: new Date().toISOString(),
    });
  };

  const formatCompetence = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "MMM/yyyy", { locale: ptBR }).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredDeclarations?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma declaração encontrada.</p>
        <p className="text-sm mt-1">Adicione declarações para seus clientes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead>Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Competência</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDeclarations.map((dec) => (
            <TableRow key={dec.id} className="hover:bg-secondary/20">
              <TableCell className="font-medium">
                {dec.client?.trade_name || dec.client?.company_name || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {dec.client?.cnpj || "—"}
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {DECLARATION_TYPE_LABELS[dec.type]}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {formatCompetence(dec.competence_month)}
              </TableCell>
              <TableCell>
                <DeclarationStatusBadge status={dec.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {dec.due_date
                  ? format(new Date(dec.due_date), "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {dec.tax_amount
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(dec.tax_amount)
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {dec.status !== "ok" && (
                      <DropdownMenuItem onClick={() => handleMarkAsDelivered(dec.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Marcar como entregue
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteDeclaration.mutate(dec.id)}
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
