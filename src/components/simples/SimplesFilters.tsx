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
import { SimplesStatus } from "@/hooks/useSimplesLimits";

interface SimplesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus?: SimplesStatus;
  onStatusChange: (value: SimplesStatus | undefined) => void;
  selectedClient?: string;
  onClientChange: (value: string | undefined) => void;
  selectedYear?: number;
  onYearChange: (value: number | undefined) => void;
}

export const SimplesFilters = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedClient,
  onClientChange,
  selectedYear,
  onYearChange,
}: SimplesFiltersProps) => {
  const { data: clients } = useClients();
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por empresa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={selectedYear?.toString() || "all"}
        onValueChange={(value) =>
          onYearChange(value === "all" ? undefined : parseInt(value))
        }
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os anos</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus || "all"}
        onValueChange={(value) =>
          onStatusChange(value === "all" ? undefined : (value as SimplesStatus))
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="ok">Normal</SelectItem>
          <SelectItem value="attention">Atenção (80%+)</SelectItem>
          <SelectItem value="expired">Excedeu Limite</SelectItem>
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
