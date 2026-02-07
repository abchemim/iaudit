import { useState } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useClients } from "@/hooks/useClients";
import { useConsultarCndAsync } from "@/hooks/useCndJobs";

export const ConsultarCndDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<"federal" | "fgts" | "estadual">("federal");

  const { data: clients } = useClients();
  const { consultarCnd, isStarting, isProcessing, isLoading, progress, reset } = useConsultarCndAsync();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    consultarCnd(
      { client_id: selectedClient, tipo: selectedTipo },
      {
        onSuccess: () => {
          // Dialog will close when processing completes
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      setOpen(false);
      setSelectedClient("");
      setSelectedTipo("federal");
      reset();
    } else if (newOpen) {
      setOpen(true);
    }
  };

  // Auto close when processing completes successfully
  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      setSelectedClient("");
      setSelectedTipo("federal");
      reset();
    }
  };

  const tiposDisponiveis = [
    { value: "federal", label: "🏛️ CND Federal (PGFN)" },
    { value: "fgts", label: "🏦 CRF FGTS (Caixa)" },
    { value: "estadual", label: "📍 CND Estadual (SEFAZ PR)" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <SearchIcon className="w-4 h-4 mr-2" />
          Consultar CND
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Consultar Certidão</DialogTitle>
          <DialogDescription>
            Realize uma consulta manual de CND via InfoSimples. Os créditos serão consumidos automaticamente.
          </DialogDescription>
        </DialogHeader>

        {isProcessing ? (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">Processando consulta...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {progress < 25 && "Iniciando consulta..."}
              {progress >= 25 && progress < 50 && "Consultando API InfoSimples..."}
              {progress >= 50 && progress < 75 && "Processando resposta..."}
              {progress >= 75 && "Salvando certidão..."}
            </p>
            <Button variant="outline" className="w-full" onClick={handleClose} disabled={isLoading}>
              Fechar e aguardar em segundo plano
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex flex-col">
                        <span>{client.trade_name || client.company_name}</span>
                        <span className="text-xs text-muted-foreground">{client.cnpj}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Certidão</Label>
              <Select value={selectedTipo} onValueChange={(v) => setSelectedTipo(v as typeof selectedTipo)}>
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposDisponiveis.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-secondary/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">💡 Custo estimado por consulta:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• CND Federal: ~1.50 créditos</li>
                <li>• CRF FGTS: ~1.00 crédito</li>
                <li>• CND Estadual: ~1.20 créditos</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!selectedClient || isStarting}>
                {isStarting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Consultar"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
