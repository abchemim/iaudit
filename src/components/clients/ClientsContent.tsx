import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientStatsCards } from "./ClientStatsCards";
import { ClientFilters } from "./ClientFilters";
import { ClientTable } from "./ClientTable";
import { ClientFormDialog } from "./ClientFormDialog";
import { useClients } from "@/hooks/useClients";
import { useQueryClient } from "@tanstack/react-query";

const ClientsContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedRegime, setSelectedRegime] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | undefined>();

  const { data: clients, isLoading, isRefetching } = useClients();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const handleEdit = (clientId: string) => {
    setEditingClientId(clientId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingClientId(undefined);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie sua carteira de clientes e empresas.
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
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ClientStatsCards clients={clients} isLoading={isLoading} />

      {/* Filters */}
      <div className="mt-6 mb-4">
        <ClientFilters
          search={search}
          onSearchChange={setSearch}
          selectedRegime={selectedRegime}
          onRegimeChange={setSelectedRegime}
        />
      </div>

      {/* Table */}
      <div className="glass-card p-4">
        <ClientTable
          clients={clients}
          isLoading={isLoading}
          search={search}
          selectedRegime={selectedRegime}
          onEdit={handleEdit}
        />
      </div>

      {/* Form Dialog */}
      <ClientFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        clientId={editingClientId}
      />
    </div>
  );
};

export default ClientsContent;
