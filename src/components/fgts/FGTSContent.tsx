import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import FGTSStatsCards from "./FGTSStatsCards";
import FGTSFilters from "./FGTSFilters";
import FGTSTable from "./FGTSTable";
import { FGTSFormDialog } from "./FGTSFormDialog";
import type { FGTSFilters as FGTSFiltersType } from "@/hooks/useFGTSRecords";
import { useQueryClient } from "@tanstack/react-query";

const FGTSContent = () => {
  const [filters, setFilters] = useState<FGTSFiltersType>({});
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["fgts-records"] });
    queryClient.invalidateQueries({ queryKey: ["fgts-stats"] });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">FGTS Digital</h2>
          <p className="text-sm text-muted-foreground">
            Monitore e gerencie as guias do FGTS Digital dos seus clientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <FGTSFormDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6">
        <FGTSStatsCards />
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FGTSFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Table */}
      <FGTSTable filters={filters} />
    </div>
  );
};

export default FGTSContent;
