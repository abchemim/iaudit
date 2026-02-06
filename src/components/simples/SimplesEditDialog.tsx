import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useUpdateSimplesLimit, SimplesLimit } from "@/hooks/useSimplesLimits";

const formSchema = z.object({
  accumulated_revenue: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  limit_amount: z.number().min(0, "Valor deve ser maior que zero"),
});

type FormData = z.infer<typeof formSchema>;

interface SimplesEditDialogProps {
  limit: SimplesLimit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "revenue" | "limit";
}

export const SimplesEditDialog = ({ limit, open, onOpenChange, mode }: SimplesEditDialogProps) => {
  const updateSimples = useUpdateSimplesLimit();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accumulated_revenue: 0,
      limit_amount: 4800000,
    },
  });

  useEffect(() => {
    if (limit) {
      form.reset({
        accumulated_revenue: limit.accumulated_revenue,
        limit_amount: limit.limit_amount,
      });
    }
  }, [limit, form]);

  const onSubmit = (data: FormData) => {
    if (!limit) return;
    
    updateSimples.mutate(
      {
        id: limit.id,
        accumulated_revenue: data.accumulated_revenue,
        limit_amount: data.limit_amount,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "revenue" ? "Atualizar Faturamento" : "Editar Limite"}
          </DialogTitle>
        </DialogHeader>
        
        {limit && (
          <div className="p-3 bg-secondary/30 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">Empresa</p>
            <p className="font-medium">{limit.clients?.company_name}</p>
            <p className="text-xs text-muted-foreground">{limit.clients?.cnpj}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "revenue" && (
              <FormField
                control={form.control}
                name="accumulated_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faturamento Acumulado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Faturamento acumulado no ano de {limit?.year}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "limit" && (
              <FormField
                control={form.control}
                name="limit_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite do Simples Nacional (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="4.800.000,00"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Padrão: R$ 4.800.000,00 para Simples Nacional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Preview do cálculo */}
            {limit && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Prévia do cálculo</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Faturamento:</span>
                  <span className="text-right">
                    {formatCurrency(mode === "revenue" ? form.watch("accumulated_revenue") : limit.accumulated_revenue)}
                  </span>
                  <span>Limite:</span>
                  <span className="text-right">
                    {formatCurrency(mode === "limit" ? form.watch("limit_amount") : limit.limit_amount)}
                  </span>
                  <span>Utilização:</span>
                  <span className="text-right font-medium">
                    {(((mode === "revenue" ? form.watch("accumulated_revenue") : limit.accumulated_revenue) / 
                       (mode === "limit" ? form.watch("limit_amount") : limit.limit_amount)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateSimples.isPending}>
                {updateSimples.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
