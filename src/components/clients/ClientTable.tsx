import { Edit, Trash2, MoreHorizontal } from "lucide-react";
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
import { TaxRegimeBadge } from "./TaxRegimeBadge";
import { Client, useUpdateClient } from "@/hooks/useClients";

interface ClientTableProps {
  clients: Client[] | undefined;
  isLoading: boolean;
  search: string;
  selectedRegime: string | undefined;
  onEdit: (clientId: string) => void;
}

export const ClientTable = ({
  clients,
  isLoading,
  search,
  selectedRegime,
  onEdit,
}: ClientTableProps) => {
  const updateClient = useUpdateClient();

  const filteredClients = clients?.filter((client) => {
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        client.company_name.toLowerCase().includes(searchLower) ||
        client.trade_name?.toLowerCase().includes(searchLower) ||
        client.cnpj.includes(search);
      if (!matchesSearch) return false;
    }

    // Filter by regime
    if (selectedRegime && client.tax_regime !== selectedRegime) {
      return false;
    }

    return true;
  });

  const handleDeactivate = (client: Client) => {
    updateClient.mutate({
      id: client.id,
      is_active: false,
    });
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

  if (!filteredClients?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum cliente encontrado.</p>
        <p className="text-sm mt-1">Clique em "Novo Cliente" para adicionar.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead>Razão Social</TableHead>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Regime</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id} className="hover:bg-secondary/20">
              <TableCell className="font-medium">{client.company_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {client.trade_name || "—"}
              </TableCell>
              <TableCell className="font-mono text-sm">{client.cnpj}</TableCell>
              <TableCell>
                <TaxRegimeBadge regime={client.tax_regime} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {client.email || client.phone || "—"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(client.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeactivate(client)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Desativar
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
