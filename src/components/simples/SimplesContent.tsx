import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimplesStatsCards } from "./SimplesStatsCards";
import { SimplesFilters } from "./SimplesFilters";
import { SimplesTable } from "./SimplesTable";
import { SimplesFormDialog } from "./SimplesFormDialog";
import { useSimplesLimits, SimplesStatus } from "@/hooks/useSimplesLimits";
import { useQueryClient } from "@tanstack/react-query";

const SimplesContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SimplesStatus | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  const { data: limits, isLoading, isRefetching } = useSimplesLimits({
    status: selectedStatus,
    clientId: selectedClient,
    year: selectedYear,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["simples-limits"] });
    queryClient.invalidateQueries({ queryKey: ["simples-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sublimites do Simples Nacional</h2>
          <p className="text-sm text-muted-foreground">
            Monitore o faturamento acumulado e proximidade do limite do Simples Nacional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <SimplesFormDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <SimplesStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4">
        <SimplesFilters
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Table */}
      <div className="glass-card p-4">
        <SimplesTable
          limits={limits}
          isLoading={isLoading}
          search={search}
        />
      </div>
    </div>
  );
};

export default SimplesContent;
