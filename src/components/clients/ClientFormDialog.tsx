import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClient, useCreateClient, useUpdateClient, TaxRegime } from "@/hooks/useClients";

const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

const clientFormSchema = z.object({
  company_name: z.string().min(2, "Razão social é obrigatória"),
  trade_name: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
  tax_regime: z.enum(["simples_nacional", "lucro_presumido", "lucro_real", "mei"]),
  state_registration: z.string().optional(),
  municipal_registration: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string;
}

export const ClientFormDialog = ({
  open,
  onOpenChange,
  clientId,
}: ClientFormDialogProps) => {
  const { data: existingClient, isLoading: isLoadingClient } = useClient(clientId);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      company_name: "",
      trade_name: "",
      cnpj: "",
      tax_regime: "simples_nacional",
      state_registration: "",
      municipal_registration: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  useEffect(() => {
    if (existingClient) {
      form.reset({
        company_name: existingClient.company_name,
        trade_name: existingClient.trade_name || "",
        cnpj: existingClient.cnpj,
        tax_regime: existingClient.tax_regime,
        state_registration: existingClient.state_registration || "",
        municipal_registration: existingClient.municipal_registration || "",
        email: existingClient.email || "",
        phone: existingClient.phone || "",
        address: existingClient.address || "",
        city: existingClient.city || "",
        state: existingClient.state || "",
        zip_code: existingClient.zip_code || "",
      });
    } else if (!clientId) {
      form.reset({
        company_name: "",
        trade_name: "",
        cnpj: "",
        tax_regime: "simples_nacional",
        state_registration: "",
        municipal_registration: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
      });
    }
  }, [existingClient, clientId, form]);

  const onSubmit = (data: ClientFormData) => {
    const payload = {
      company_name: data.company_name,
      cnpj: data.cnpj,
      tax_regime: data.tax_regime,
      trade_name: data.trade_name || null,
      state_registration: data.state_registration || null,
      municipal_registration: data.municipal_registration || null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zip_code || null,
      is_active: true,
    };

    if (clientId) {
      updateClient.mutate(
        { id: clientId, ...payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createClient.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isSubmitting = createClient.isPending || updateClient.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clientId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {clientId
              ? "Atualize as informações do cliente."
              : "Preencha os dados para cadastrar um novo cliente."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingClient && clientId ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Dados da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input placeholder="Empresa Ltda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trade_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Fantasia</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome comercial" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_regime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime Tributário *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(TAX_REGIME_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state_registration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="municipal_registration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Municipal</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, complemento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-2">
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : clientId ? (
                    "Salvar Alterações"
                  ) : (
                    "Cadastrar Cliente"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
