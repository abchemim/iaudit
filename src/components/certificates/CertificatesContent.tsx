import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateStatsCards } from "./CertificateStatsCards";
import { CertificateFilters } from "./CertificateFilters";
import { CertificateTable } from "./CertificateTable";
import { QueryCertificateDialog } from "./QueryCertificateDialog";
import {
  useCertificates,
  CertificateType,
  CertificateStatus,
} from "@/hooks/useCertificates";
import { useQueryClient } from "@tanstack/react-query";

const CertificatesContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CertificateType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<CertificateStatus | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();

  const { data: certificates, isLoading, isRefetching } = useCertificates({
    type: selectedType,
    status: selectedStatus,
    clientId: selectedClient,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["certificates"] });
    queryClient.invalidateQueries({ queryKey: ["certificate-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Certidões</h2>
          <p className="text-sm text-muted-foreground">
            Monitore as CNDs Federal, Estadual e CRF FGTS dos seus clientes.
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
          <QueryCertificateDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <CertificateStatsCards />

      {/* Filters */}
      <div className="mt-6 mb-4">
        <CertificateFilters
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
        <CertificateTable
          certificates={certificates}
          isLoading={isLoading}
          search={search}
        />
      </div>
    </div>
  );
};

export default CertificatesContent;
