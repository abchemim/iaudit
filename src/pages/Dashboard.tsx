import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Bell, Search, Building2, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockClients = [
  {
    id: 1,
    name: "Tech Solutions LTDA",
    cnpj: "12.345.678/0001-90",
    cndFederal: "ok",
    cndEstadual: "warning",
    cndMunicipal: "ok",
    fgts: "ok",
    lastUpdate: "Há 2 horas",
  },
  {
    id: 2,
    name: "Construtora ABC",
    cnpj: "98.765.432/0001-10",
    cndFederal: "danger",
    cndEstadual: "ok",
    cndMunicipal: "ok",
    fgts: "warning",
    lastUpdate: "Há 4 horas",
  },
  {
    id: 3,
    name: "Comércio XYZ",
    cnpj: "45.678.901/0001-23",
    cndFederal: "ok",
    cndEstadual: "ok",
    cndMunicipal: "ok",
    fgts: "ok",
    lastUpdate: "Há 1 hora",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    ok: { label: "Regular", icon: CheckCircle, className: "status-success" },
    warning: { label: "Pendente", icon: AlertTriangle, className: "status-warning" },
    danger: { label: "Irregular", icon: AlertTriangle, className: "status-danger" },
  }[status] || { label: "N/A", icon: AlertTriangle, className: "status-warning" };

  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
    navigate("/");
  };

  const stats = {
    total: mockClients.length,
    regular: mockClients.filter(c => c.cndFederal === "ok" && c.fgts === "ok").length,
    pendentes: mockClients.filter(c => c.cndFederal === "warning" || c.fgts === "warning").length,
    irregulares: mockClients.filter(c => c.cndFederal === "danger" || c.fgts === "danger").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold">
                <span className="text-foreground">IA</span>
                <span className="text-gradient">udit</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-danger rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>{user?.email}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitore a situação fiscal dos seus clientes em tempo real.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Clientes", value: stats.total, icon: Building2, color: "text-primary" },
            { label: "Regulares", value: stats.regular, icon: CheckCircle, color: "text-status-success" },
            { label: "Pendências", value: stats.pendentes, icon: AlertTriangle, color: "text-status-warning" },
            { label: "Irregulares", value: stats.irregulares, icon: AlertTriangle, color: "text-status-danger" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por cliente ou CNPJ..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button variant="outline">
            <FileCheck className="w-4 h-4 mr-2" />
            Atualizar CNDs
          </Button>
        </div>

        {/* Clients Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">CND Federal</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">CND Estadual</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">CND Municipal</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">FGTS</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {mockClients.map((client) => (
                  <tr key={client.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.cnpj}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={client.cndFederal} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={client.cndEstadual} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={client.cndMunicipal} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={client.fgts} />
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-muted-foreground">
                      {client.lastUpdate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
