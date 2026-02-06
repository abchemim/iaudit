import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";
import { DeclarationType, DeclarationStatus, DECLARATION_TYPE_LABELS } from "@/hooks/useDeclarations";

interface DeclarationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: DeclarationType | undefined;
  onTypeChange: (value: DeclarationType | undefined) => void;
  selectedStatus: DeclarationStatus | undefined;
  onStatusChange: (value: DeclarationStatus | undefined) => void;
  selectedClient: string | undefined;
  onClientChange: (value: string | undefined) => void;
}

export const DeclarationFilters = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedClient,
  onClientChange,
}: DeclarationFiltersProps) => {
  const { data: clients } = useClients();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por empresa ou CNPJ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      <Select
        value={selectedType || "all"}
        onValueChange={(value) => onTypeChange(value === "all" ? undefined : (value as DeclarationType))}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-secondary/50">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          {Object.entries(DECLARATION_TYPE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus || "all"}
        onValueChange={(value) => onStatusChange(value === "all" ? undefined : (value as DeclarationStatus))}
      >
        <SelectTrigger className="w-full md:w-[140px] bg-secondary/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="ok">Entregue</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="attention">Atenção</SelectItem>
          <SelectItem value="expired">Atrasada</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={selectedClient || "all"}
        onValueChange={(value) => onClientChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full md:w-[200px] bg-secondary/50">
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
    </div>
  );
};
