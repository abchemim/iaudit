import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import type { FGTSFilters as FGTSFiltersType, FGTSStatus } from "@/hooks/useFGTSRecords";

interface FGTSFiltersProps {
  filters: FGTSFiltersType;
  onFiltersChange: (filters: FGTSFiltersType) => void;
}

const FGTSFilters = ({ filters, onFiltersChange }: FGTSFiltersProps) => {
  const { data: clients } = useClients();
  const [searchTerm, setSearchTerm] = useState("");

  const hasActiveFilters = filters.status || filters.clientId;

  const clearFilters = () => {
    onFiltersChange({});
    setSearchTerm("");
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? undefined : (value as FGTSStatus),
            })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ok">Pago</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="attention">Atenção</SelectItem>
            <SelectItem value="expired">Vencido</SelectItem>
          </SelectContent>
        </Select>

        {/* Client Filter */}
        <Select
          value={filters.clientId || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              clientId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.trade_name || client.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FGTSFilters;
