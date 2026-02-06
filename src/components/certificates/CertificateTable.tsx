import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw, Trash2, ExternalLink } from "lucide-react";
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
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import {
  Certificate,
  CERTIFICATE_TYPE_LABELS,
  useQueryCertificate,
  useDeleteCertificate,
} from "@/hooks/useCertificates";

interface CertificateTableProps {
  certificates: Certificate[] | undefined;
  isLoading: boolean;
  search: string;
}

export const CertificateTable = ({ certificates, isLoading, search }: CertificateTableProps) => {
  const queryCertificate = useQueryCertificate();
  const deleteCertificate = useDeleteCertificate();

  const filteredCertificates = certificates?.filter((cert) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      cert.client?.company_name.toLowerCase().includes(searchLower) ||
      cert.client?.trade_name?.toLowerCase().includes(searchLower) ||
      cert.client?.cnpj.includes(search)
    );
  });

  const handleRefresh = (cert: Certificate) => {
    if (!cert.client || !["cnd_federal", "cnd_estadual", "cnd_fgts"].includes(cert.type)) return;
    
    queryCertificate.mutate({
      client_id: cert.client_id,
      certificate_type: cert.type as "cnd_federal" | "cnd_estadual" | "cnd_fgts",
      cnpj: cert.client.cnpj,
    });
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

  if (!filteredCertificates?.length) {
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
            <TableHead>Status</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Última Consulta</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCertificates.map((cert) => (
            <TableRow key={cert.id} className="hover:bg-secondary/20">
              <TableCell className="font-medium">
                {cert.client?.trade_name || cert.client?.company_name || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {cert.client?.cnpj || "—"}
              </TableCell>
              <TableCell>
                <span className="text-sm">{CERTIFICATE_TYPE_LABELS[cert.type]}</span>
              </TableCell>
              <TableCell>
                <CertificateStatusBadge status={cert.status} />
              </TableCell>
              <TableCell>
                {cert.expiry_date
                  ? format(new Date(cert.expiry_date), "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {cert.last_checked_at
                  ? format(new Date(cert.last_checked_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {cert.document_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={cert.document_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {["cnd_federal", "cnd_estadual", "cnd_fgts"].includes(cert.type) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRefresh(cert)}
                      disabled={queryCertificate.isPending}
                    >
                      <RefreshCw className={`w-4 h-4 ${queryCertificate.isPending ? "animate-spin" : ""}`} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteCertificate.mutate(cert.id)}
                    disabled={deleteCertificate.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
