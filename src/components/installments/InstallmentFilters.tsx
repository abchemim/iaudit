import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { InstallmentStatus } from "@/hooks/useInstallments";

interface InstallmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus?: InstallmentStatus;
  onStatusChange: (value: InstallmentStatus | undefined) => void;
  selectedClient?: string;
  onClientChange: (value: string | undefined) => void;
}

export const InstallmentFilters = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedClient,
  onClientChange,
}: InstallmentFiltersProps) => {
  const { data: clients } = useClients();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por programa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={selectedStatus || "all"}
        onValueChange={(value) =>
          onStatusChange(value === "all" ? undefined : (value as InstallmentStatus))
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="ok">Em dia</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="attention">Atenção</SelectItem>
          <SelectItem value="expired">Atrasado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={selectedClient || "all"}
        onValueChange={(value) =>
          onClientChange(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os clientes</SelectItem>
          {clients?.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.company_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
