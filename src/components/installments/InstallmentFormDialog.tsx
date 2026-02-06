import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useCreateInstallment, InstallmentStatus } from "@/hooks/useInstallments";

const formSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),
  program_name: z.string().min(1, "Nome do programa é obrigatório"),
  total_amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  installment_count: z.number().int().min(1, "Mínimo de 1 parcela"),
  monthly_amount: z.number().optional(),
  start_date: z.string().optional(),
  next_due_date: z.string().optional(),
  status: z.enum(["ok", "pending", "attention", "expired"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const InstallmentFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { data: clients } = useClients();
  const createInstallment = useCreateInstallment();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      program_name: "",
      total_amount: 0,
      installment_count: 1,
      status: "ok",
      notes: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const monthlyAmount = data.monthly_amount || data.total_amount / data.installment_count;
    
    createInstallment.mutate(
      {
        client_id: data.client_id,
        program_name: data.program_name,
        total_amount: data.total_amount,
        paid_amount: 0,
        installment_count: data.installment_count,
        current_installment: 0,
        monthly_amount: monthlyAmount,
        start_date: data.start_date || null,
        next_due_date: data.next_due_date || null,
        status: data.status as InstallmentStatus,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Parcelamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Parcelamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Programa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: REFIS, PERT, Simples Nacional..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installment_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd. Parcelas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ok">Em dia</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="attention">Atenção</SelectItem>
                      <SelectItem value="expired">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createInstallment.isPending}>
                {createInstallment.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
