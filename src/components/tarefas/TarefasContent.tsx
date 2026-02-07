import { useState } from "react";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useClients } from "@/hooks/useClients";
import {
  useTarefas,
  TarefaStatus,
  TarefaPrioridade,
  TAREFA_STATUS_LABELS,
  TAREFA_PRIORIDADE_LABELS,
} from "@/hooks/useTarefas";
import { TarefasStatsCards } from "./TarefasStatsCards";
import { TarefasTable } from "./TarefasTable";
import { TarefaFormDialog } from "./TarefaFormDialog";

const TarefasContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TarefaStatus | undefined>();
  const [selectedPrioridade, setSelectedPrioridade] = useState<TarefaPrioridade | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: clients } = useClients();
  const { data: tarefas, isLoading, isRefetching } = useTarefas({
    status: selectedStatus,
    prioridade: selectedPrioridade,
    clientId: selectedClient,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    queryClient.invalidateQueries({ queryKey: ["tarefas-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Tarefas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas tarefas e acompanhe o progresso
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
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <TarefasStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => setSelectedStatus(value === "all" ? undefined : (value as TarefaStatus))}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-secondary/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(TAREFA_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPrioridade || "all"}
          onValueChange={(value) => setSelectedPrioridade(value === "all" ? undefined : (value as TarefaPrioridade))}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-secondary/50">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(TAREFA_PRIORIDADE_LABELS).map(([key, label]) => (
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
        <TarefasTable tarefas={tarefas} isLoading={isLoading} search={search} />
      </div>

      {/* Create Dialog */}
      <TarefaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default TarefasContent;
