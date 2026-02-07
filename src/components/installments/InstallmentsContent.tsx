import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallmentStatsCards } from "./InstallmentStatsCards";
import { InstallmentFilters } from "./InstallmentFilters";
import { InstallmentTable } from "./InstallmentTable";
import { InstallmentFormDialog } from "./InstallmentFormDialog";
import { useInstallments, InstallmentStatus } from "@/hooks/useInstallments";
import { useQueryClient } from "@tanstack/react-query";

const InstallmentsContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<InstallmentStatus | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();

  const { data: installments, isLoading, isRefetching } = useInstallments({
    status: selectedStatus,
    clientId: selectedClient,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["installments"] });
    queryClient.invalidateQueries({ queryKey: ["installment-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Parcelamentos</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe os parcelamentos fiscais de seus clientes.
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
          <InstallmentFormDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <InstallmentStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4">
        <InstallmentFilters
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
        />
      </div>

      {/* Table */}
      <div className="glass-card p-4">
        <InstallmentTable
          installments={installments}
          isLoading={isLoading}
          search={search}
        />
      </div>
    </div>
  );
};

export default InstallmentsContent;
