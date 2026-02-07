import { useState } from "react";
import { RefreshCw, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useClients } from "@/hooks/useClients";
import { CndTable } from "./CndTable";
import { CndStatsCards } from "./CndStatsCards";
import { ConsultarCndDialog } from "./ConsultarCndDialog";
import {
  useCndCertidoes,
  CndTipo,
  CndStatus,
  CND_TIPO_LABELS,
  CND_STATUS_LABELS,
} from "@/hooks/useCndCertidoes";

const CertificatesContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<CndTipo | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<CndStatus | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();

  const { data: clients } = useClients();
  const { data: cnds, isLoading, isRefetching } = useCndCertidoes({
    tipo: selectedTipo,
    status: selectedStatus,
    clientId: selectedClient,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["cnd-certidoes"] });
    queryClient.invalidateQueries({ queryKey: ["cnd-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Certidões Negativas de Débito</h2>
          <p className="text-sm text-muted-foreground">
            Monitoramento automático de CNDs via InfoSimples
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <ConsultarCndDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <CndStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por empresa ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <Select
          value={selectedTipo || "all"}
          onValueChange={(value) => setSelectedTipo(value === "all" ? undefined : (value as CndTipo))}
        >
          <SelectTrigger className="w-full md:w-[200px] bg-secondary/50">
            <SelectValue placeholder="Tipo de certidão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(CND_TIPO_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => setSelectedStatus(value === "all" ? undefined : (value as CndStatus))}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-secondary/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(CND_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedClient || "all"}
          onValueChange={(value) => setSelectedClient(value === "all" ? undefined : value)}
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

      {/* Table */}
      <div className="glass-card p-4">
        <CndTable cnds={cnds} isLoading={isLoading} search={search} />
      </div>

      {/* Next Checks Info */}
      <Card className="mt-6 p-4 glass-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📅 Próximas Verificações Automáticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
            <span>CND Federal (todas empresas)</span>
            <span className="text-muted-foreground">Diário, 08:00</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
            <span>FGTS (todas empresas)</span>
            <span className="text-muted-foreground">Diário, 09:00</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
            <span>CND Estadual</span>
            <span className="text-muted-foreground">Quinzenal, 10:00</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificatesContent;
