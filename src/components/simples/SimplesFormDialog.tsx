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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { useCreateSimplesLimit } from "@/hooks/useSimplesLimits";

const formSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),
  year: z.number().int().min(2020).max(2030),
  limit_amount: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  accumulated_revenue: z.number().min(0, "Valor deve ser maior ou igual a zero"),
});

type FormData = z.infer<typeof formSchema>;

export const SimplesFormDialog = () => {
  const [open, setOpen] = useState(false);
  const { data: clients } = useClients();
  const createLimit = useCreateSimplesLimit();
  const currentYear = new Date().getFullYear();

  // Filter only Simples Nacional clients
  const simplesClients = clients?.filter(
    (c) => c.tax_regime === "simples_nacional" || c.tax_regime === "mei"
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      year: currentYear,
      limit_amount: 4800000, // Default Simples Nacional limit
      accumulated_revenue: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    createLimit.mutate(
      {
        client_id: data.client_id,
        year: data.year,
        limit_amount: data.limit_amount,
        accumulated_revenue: data.accumulated_revenue,
        percentage_used: null,
        status: "ok",
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
          Novo Sublimite
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Sublimite do Simples</DialogTitle>
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
                      {simplesClients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Apenas clientes do Simples Nacional ou MEI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano de Referência</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={(currentYear).toString()}>{currentYear}</SelectItem>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                      <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite do Simples Nacional</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="4.800.000,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Limite padrão: R$ 4.800.000,00. MEI: R$ 81.000,00
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accumulated_revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faturamento Acumulado</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Receita bruta acumulada no ano-calendário
                  </FormDescription>
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
              <Button type="submit" disabled={createLimit.isPending}>
                {createLimit.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
