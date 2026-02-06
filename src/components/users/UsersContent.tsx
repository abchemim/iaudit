import { useState } from "react";
import { Plus, Users, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUserProfile, ROLE_LABELS } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";

const UsersContent = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useCurrentUserProfile();
  const [search, setSearch] = useState("");

  // For now, we only show the current user's profile
  // In a multi-tenant setup, you would fetch all users in the organization
  const users = profile ? [profile] : [];

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Usuários</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários e permissões do sistema.
          </p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-success/10">
                <UserCheck className="w-5 h-5 text-status-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Shield className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Users Table */}
      <div className="glass-card p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{u.name || "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        u.is_active
                          ? "bg-status-success/10 text-status-success border-status-success/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {u.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleString("pt-BR")
                      : "Nunca"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Current User Info */}
      <Card className="mt-6 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Usuário Atual</p>
              <p className="text-sm text-muted-foreground">
                Logado como: {user?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-user Notice */}
      <Card className="mt-4 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Gerenciamento de Equipe</p>
              <p className="text-sm text-muted-foreground">
                O gerenciamento multi-usuário está disponível em planos empresariais. 
                Entre em contato para adicionar mais usuários ao seu escritório.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersContent;
