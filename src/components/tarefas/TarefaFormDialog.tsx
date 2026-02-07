import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";
import {
  Tarefa,
  TarefaStatus,
  TarefaPrioridade,
  TarefaTipo,
  useCreateTarefa,
  useUpdateTarefa,
  TAREFA_STATUS_LABELS,
  TAREFA_PRIORIDADE_LABELS,
} from "@/hooks/useTarefas";

const TAREFA_TIPO_LABELS: Record<TarefaTipo, string> = {
  verificacao: "Verificação",
  renovacao: "Renovação",
  correcao: "Correção",
  outro: "Outro",
};

interface TarefaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarefa?: Tarefa | null;
}

export const TarefaFormDialog = ({ open, onOpenChange, tarefa }: TarefaFormDialogProps) => {
  const { data: clients } = useClients();
  const createTarefa = useCreateTarefa();
  const updateTarefa = useUpdateTarefa();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TarefaTipo>("verificacao");
  const [prioridade, setPrioridade] = useState<TarefaPrioridade>("media");
  const [status, setStatus] = useState<TarefaStatus>("pendente");
  const [clientId, setClientId] = useState<string>("");
  const [vencimento, setVencimento] = useState("");

  const isEditing = !!tarefa;
  const isPending = createTarefa.isPending || updateTarefa.isPending;

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao || "");
      setTipo(tarefa.tipo);
      setPrioridade(tarefa.prioridade);
      setStatus(tarefa.status);
      setClientId(tarefa.client_id || "");
      setVencimento(tarefa.vencimento || "");
    } else {
      resetForm();
    }
  }, [tarefa, open]);

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setTipo("verificacao");
    setPrioridade("media");
    setStatus("pendente");
    setClientId("");
    setVencimento("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      titulo,
      descricao: descricao || null,
      tipo,
      prioridade,
      status,
      client_id: clientId || null,
      vencimento: vencimento || null,
      user_id: null,
      relacionado_tipo: null,
      relacionado_id: null,
    };

    if (isEditing && tarefa) {
      updateTarefa.mutate(
        { id: tarefa.id, ...data },
        {
          onSuccess: () => {
            onOpenChange(false);
            resetForm();
          },
        }
      );
    } else {
      createTarefa.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da tarefa."
              : "Preencha os dados para criar uma nova tarefa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição detalhada (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value as TarefaTipo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TAREFA_TIPO_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={prioridade} onValueChange={(value) => setPrioridade(value as TarefaPrioridade)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TAREFA_PRIORIDADE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isEditing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TarefaStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TAREFA_STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="vencimento">Vencimento</Label>
              <Input
                id="vencimento"
                type="date"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <Select value={clientId || "none"} onValueChange={(value) => setClientId(value === "none" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum cliente</SelectItem>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.trade_name || client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !titulo}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
