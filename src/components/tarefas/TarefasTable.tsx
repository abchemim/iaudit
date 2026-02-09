import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2, CheckCircle, Play, Pause } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tarefa,
  TarefaStatus,
  useUpdateTarefa,
  useDeleteTarefa,
  TAREFA_STATUS_LABELS,
  TAREFA_PRIORIDADE_LABELS,
} from "@/hooks/useTarefas";
import { TarefaFormDialog } from "./TarefaFormDialog";

interface TarefasTableProps {
  tarefas: Tarefa[] | undefined;
  isLoading: boolean;
  search: string;
}

const statusColors: Record<TarefaStatus, string> = {
  pendente: "bg-status-warning/15 text-status-warning border-status-warning/30",
  em_andamento: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  concluida: "bg-status-success/15 text-status-success border-status-success/30",
};

const prioridadeColors: Record<string, string> = {
  alta: "bg-status-danger/15 text-status-danger border-status-danger/30",
  media: "bg-status-warning/15 text-status-warning border-status-warning/30",
  baixa: "bg-muted text-muted-foreground border-border",
};

export const TarefasTable = ({ tarefas, isLoading, search }: TarefasTableProps) => {
  const updateTarefa = useUpdateTarefa();
  const deleteTarefa = useDeleteTarefa();
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTarefas = tarefas?.filter((tarefa) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      tarefa.titulo.toLowerCase().includes(searchLower) ||
      tarefa.descricao?.toLowerCase().includes(searchLower) ||
      tarefa.clients?.company_name.toLowerCase().includes(searchLower)
    );
  });

  const handleStatusChange = (id: string, newStatus: TarefaStatus) => {
    updateTarefa.mutate({ id, status: newStatus });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteTarefa.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredTarefas?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma tarefa encontrada.</p>
        <p className="text-sm">Crie uma nova tarefa para começar.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTarefas.map((tarefa) => (
            <TableRow key={tarefa.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{tarefa.titulo}</p>
                  {tarefa.descricao && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tarefa.descricao}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {tarefa.clients?.company_name || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={prioridadeColors[tarefa.prioridade]}>
                  {TAREFA_PRIORIDADE_LABELS[tarefa.prioridade]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[tarefa.status]}>
                  {TAREFA_STATUS_LABELS[tarefa.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {tarefa.data_vencimento ? (
                  <span className={
                    new Date(tarefa.data_vencimento) < new Date() && tarefa.status !== "concluida"
                      ? "text-status-danger"
                      : ""
                  }>
                    {format(new Date(tarefa.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {tarefa.status === "pendente" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(tarefa.id, "em_andamento")}>
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </DropdownMenuItem>
                    )}
                    {tarefa.status === "em_andamento" && (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusChange(tarefa.id, "pendente")}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(tarefa.id, "concluida")}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Concluir
                        </DropdownMenuItem>
                      </>
                    )}
                    {tarefa.status === "pendente" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(tarefa.id, "concluida")}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Concluir
                      </DropdownMenuItem>
                    )}
                    {tarefa.status === "concluida" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(tarefa.id, "pendente")}>
                        <Play className="w-4 h-4 mr-2" />
                        Reabrir
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditingTarefa(tarefa)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(tarefa.id)}
                      className="text-status-danger"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <TarefaFormDialog
        open={!!editingTarefa}
        onOpenChange={(open) => !open && setEditingTarefa(null)}
        tarefa={editingTarefa}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-status-danger hover:bg-status-danger/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
