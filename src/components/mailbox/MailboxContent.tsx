import { useState } from "react";
import { RefreshCw, Mail, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMailboxMessages, useMailboxStats, useUpdateMailboxMessage } from "@/hooks/useMailbox";
import { useQueryClient } from "@tanstack/react-query";

const MailboxContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    isRefetching,
  } = useMailboxMessages(statusFilter !== "all" ? { status: statusFilter as "unread" | "read" } : undefined);
  const { data: stats } = useMailboxStats();
  const updateMessage = useUpdateMailboxMessage();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["mailbox-messages"] });
    queryClient.invalidateQueries({ queryKey: ["mailbox-stats"] });
  };

  const handleMarkAsRead = (id: string) => {
    updateMessage.mutate({ id, status: "read" });
  };

  const filteredMessages =
    messages?.filter((msg) => {
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          msg.client?.company_name.toLowerCase().includes(searchLower) ||
          msg.client?.trade_name?.toLowerCase().includes(searchLower) ||
          msg.subject.toLowerCase().includes(searchLower) ||
          msg.client?.cnpj.includes(search)
        );
      }
      return true;
    }) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-status-danger text-white";
      case "medium":
        return "bg-status-warning text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Urgente";
      case "medium":
        return "Média";
      default:
        return "Baixa";
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Caixas Postais</h2>
          <p className="text-sm text-muted-foreground">Monitore as caixas postais do e-CAC e SEFAZ de seus clientes.</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-xs text-muted-foreground">Total de Mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Clock className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.unread || 0}</p>
                <p className="text-xs text-muted-foreground">Não Lidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-danger/10">
                <AlertCircle className="w-5 h-5 text-status-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.highPriority || 0}</p>
                <p className="text-xs text-muted-foreground">Alta Prioridade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por empresa ou assunto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="unread">Não lidas</SelectItem>
            <SelectItem value="read">Lidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="glass-card divide-y divide-border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma mensagem encontrada.</p>
            <p className="text-sm mt-1">As mensagens do e-CAC e SEFAZ aparecerão aqui quando sincronizadas.</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 hover:bg-secondary/30 cursor-pointer transition-colors ${
                message.status === "unread" ? "bg-primary/5" : ""
              }`}
              onClick={() => message.status === "unread" && handleMarkAsRead(message.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    message.status === "unread" ? "bg-primary" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {message.client?.trade_name || message.client?.company_name || "—"}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{message.client?.cnpj}</span>
                  </div>
                  <p className="text-sm text-foreground truncate">{message.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {message.source}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                      {getPriorityLabel(message.priority)}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(message.message_date).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Integration Notice */}
      <Card className="mt-6 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Integração com e-CAC</p>
              <p className="text-sm text-muted-foreground">
                Para sincronização automática das caixas postais, é necessário configurar o certificado A1 de cada
                cliente na área de configurações. A integração permite monitoramento 24h das mensagens da Receita
                Federal e SEFAZ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MailboxContent;
