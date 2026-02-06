import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw, Trash2, Download, Eye, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CndCertidao,
  CND_TIPO_LABELS,
  useConsultarCnd,
  useDeleteCnd,
} from "@/hooks/useCndCertidoes";

interface CndTableProps {
  cnds: CndCertidao[] | undefined;
  isLoading: boolean;
  search: string;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    valida: { variant: "default", label: "✅ Válida" },
    vencendo: { variant: "secondary", label: "⚠️ Vencendo" },
    vencida: { variant: "destructive", label: "❌ Vencida" },
    pendente: { variant: "outline", label: "⏳ Pendente" },
    erro: { variant: "destructive", label: "🚫 Erro" },
  };
  
  const config = variants[status] || { variant: "outline", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getTipoBadge = (tipo: string) => {
  const icons: Record<string, string> = {
    federal: "🏛️",
    estadual: "📍",
    fgts: "🏦",
    municipal: "🏘️",
    trabalhista: "⚖️",
  };
  return `${icons[tipo] || "📄"} ${CND_TIPO_LABELS[tipo as keyof typeof CND_TIPO_LABELS] || tipo}`;
};

const getDiasRestantes = (dataValidade: string | null) => {
  if (!dataValidade) return null;
  const hoje = new Date();
  const validade = new Date(dataValidade);
  return Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
};

export const CndTable = ({ cnds, isLoading, search }: CndTableProps) => {
  const consultarCnd = useConsultarCnd();
  const deleteCnd = useDeleteCnd();

  const filteredCnds = cnds?.filter((cnd) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      cnd.clients?.company_name.toLowerCase().includes(searchLower) ||
      cnd.clients?.trade_name?.toLowerCase().includes(searchLower) ||
      cnd.clients?.cnpj.includes(search)
    );
  });

  const handleRefresh = (cnd: CndCertidao) => {
    if (!["federal", "estadual", "fgts"].includes(cnd.tipo)) return;
    
    consultarCnd.mutate({
      client_id: cnd.client_id,
      tipo: cnd.tipo as "federal" | "fgts" | "estadual",
    });
  };

  const handleDownloadPdf = (cnd: CndCertidao) => {
    if (cnd.arquivo_url) {
      window.open(cnd.arquivo_url, "_blank");
    } else if (cnd.pdf_base64) {
      // Create blob from base64 and download
      const byteCharacters = atob(cnd.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cnd.arquivo_nome || `CND_${cnd.tipo}_${cnd.clients?.cnpj}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredCnds?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma certidão encontrada.</p>
        <p className="text-sm mt-1">Adicione clientes e consulte suas certidões.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead>Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Automática</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCnds.map((cnd) => {
            const diasRestantes = getDiasRestantes(cnd.data_validade);
            
            return (
              <TableRow key={cnd.id} className="hover:bg-secondary/20">
                <TableCell className="font-medium">
                  <div>
                    <p>{cnd.clients?.trade_name || cnd.clients?.company_name || "—"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {cnd.clients?.cnpj || "—"}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{getTipoBadge(cnd.tipo)}</span>
                </TableCell>
                <TableCell className="text-sm">
                  {cnd.numero_certidao || "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {cnd.data_emissao
                    ? format(new Date(cnd.data_emissao), "dd/MM/yyyy", { locale: ptBR })
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {cnd.data_validade
                      ? format(new Date(cnd.data_validade), "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                    {diasRestantes !== null && diasRestantes <= 15 && diasRestantes >= 0 && (
                      <span className="text-xs text-status-warning block">
                        ({diasRestantes}d restantes)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(cnd.status)}
                </TableCell>
                <TableCell>
                  {cnd.obtida_automaticamente ? (
                    <Badge variant="secondary">✅ Sim</Badge>
                  ) : (
                    <Badge variant="outline">👤 Manual</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(cnd.arquivo_url || cnd.pdf_base64) && (
                        <DropdownMenuItem onClick={() => handleDownloadPdf(cnd)}>
                          <Download className="w-4 h-4 mr-2" />
                          Baixar PDF
                        </DropdownMenuItem>
                      )}
                      {["federal", "estadual", "fgts"].includes(cnd.tipo) && (
                        <DropdownMenuItem 
                          onClick={() => handleRefresh(cnd)}
                          disabled={consultarCnd.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${consultarCnd.isPending ? "animate-spin" : ""}`} />
                          Consultar Novamente
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteCnd.mutate(cnd.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
