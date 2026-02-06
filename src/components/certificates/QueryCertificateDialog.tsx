import { useState } from "react";
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
import { Search, Loader2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useQueryCertificate, CERTIFICATE_TYPE_LABELS } from "@/hooks/useCertificates";

const QUERYABLE_TYPES = ["cnd_federal", "cnd_estadual", "cnd_fgts"] as const;

export const QueryCertificateDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: clients } = useClients();
  const queryCertificate = useQueryCertificate();

  const selectedClientData = clients?.find((c) => c.id === selectedClient);

  const handleQuery = () => {
    if (!selectedClient || !selectedType || !selectedClientData) return;

    queryCertificate.mutate(
      {
        client_id: selectedClient,
        certificate_type: selectedType as "cnd_federal" | "cnd_estadual" | "cnd_fgts",
        cnpj: selectedClientData.cnpj,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedClient("");
          setSelectedType("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Search className="w-4 h-4" />
          Nova Consulta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consultar Certidão</DialogTitle>
          <DialogDescription>
            Selecione o cliente e o tipo de certidão para realizar a consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.trade_name || client.company_name} - {client.cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Certidão</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {QUERYABLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {CERTIFICATE_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleQuery}
            disabled={!selectedClient || !selectedType || queryCertificate.isPending}
          >
            {queryCertificate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Consultando...
              </>
            ) : (
              "Consultar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
