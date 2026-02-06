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
import { useCreateFGTSRecord } from "@/hooks/useFGTSRecords";

const formSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),
  competence_month: z.string().min(1, "Competência é obrigatória"),
  due_date: z.string().optional(),
  amount: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  guide_number: z.string().optional(),
  status: z.enum(["ok", "pending", "attention", "expired"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const FGTSFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { data: clients } = useClients();
  const createFGTS = useCreateFGTSRecord();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      competence_month: "",
      status: "pending",
      notes: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createFGTS.mutate(
      {
        client_id: data.client_id,
        competence_month: data.competence_month,
        due_date: data.due_date || null,
        amount: data.amount || null,
        guide_number: data.guide_number || null,
        status: data.status,
        notes: data.notes || null,
        paid_amount: null,
        paid_at: null,
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
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Guia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Guia FGTS</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="competence_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competência</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guide_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Guia</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
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
                      <SelectItem value="ok">Pago</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="attention">Atenção</SelectItem>
                      <SelectItem value="expired">Vencido</SelectItem>
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
              <Button type="submit" disabled={createFGTS.isPending}>
                {createFGTS.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
