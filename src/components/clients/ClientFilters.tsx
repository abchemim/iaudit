import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaxRegime } from "@/hooks/useClients";

interface ClientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedRegime: string | undefined;
  onRegimeChange: (value: string | undefined) => void;
}

const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

export const ClientFilters = ({
  search,
  onSearchChange,
  selectedRegime,
  onRegimeChange,
}: ClientFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      <Select
        value={selectedRegime || "all"}
        onValueChange={(value) => onRegimeChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-full md:w-[200px] bg-secondary/50">
          <SelectValue placeholder="Regime tributário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os regimes</SelectItem>
          {Object.entries(TAX_REGIME_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
