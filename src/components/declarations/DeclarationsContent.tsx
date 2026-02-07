import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeclarationStatsCards } from "./DeclarationStatsCards";
import { DeclarationFilters } from "./DeclarationFilters";
import { DeclarationTable } from "./DeclarationTable";
import { DeclarationFormDialog } from "./DeclarationFormDialog";
import {
  useDeclarations,
  DeclarationType,
  DeclarationStatus,
} from "@/hooks/useDeclarations";
import { useQueryClient } from "@tanstack/react-query";

const DeclarationsContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<DeclarationType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<DeclarationStatus | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();

  const { data: declarations, isLoading, isRefetching } = useDeclarations({
    type: selectedType,
    status: selectedStatus,
    clientId: selectedClient,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["declarations"] });
    queryClient.invalidateQueries({ queryKey: ["declaration-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Declarações Fiscais</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie PGDAS, DCTFWeb, SPED e outras declarações dos seus clientes.
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
          <DeclarationFormDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <DeclarationStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4">
        <DeclarationFilters
          search={search}
          onSearchChange={setSearch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
        />
      </div>

      {/* Table */}
      <div className="glass-card p-4">
        <DeclarationTable
          declarations={declarations}
          isLoading={isLoading}
          search={search}
        />
      </div>
    </div>
  );
};

export default DeclarationsContent;
