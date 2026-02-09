import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
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
import { useClients } from "@/hooks/useClients";
import { useConsultarCnd, CND_TIPO_LABELS } from "@/hooks/useCndCertidoes";

export const ConsultarCndDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<"federal" | "fgts" | "estadual">("federal");

  const { data: clients } = useClients();
  const consultarCnd = useConsultarCnd();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    consultarCnd.mutate(
      { client_id: selectedClient, tipo: selectedTipo },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedClient("");
          setSelectedTipo("federal");
        },
      }
    );
  };

  const tiposDisponiveis = [
    { value: "federal", label: "🏛️ CND Federal (PGFN)" },
    { value: "fgts", label: "🏦 CRF FGTS (Caixa)" },
    { value: "estadual", label: "📍 CND Estadual (SEFAZ PR)" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedClient || consultarCnd.isPending}>
              {consultarCnd.isPending ? "Consultando..." : "Consultar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
