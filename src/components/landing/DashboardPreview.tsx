import { 
  FileCheck, 
  AlertTriangle, 
  XCircle, 
  Building2,
  TrendingUp,
  Clock,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock client data for dashboard preview
const mockClients = [
  {
    id: 1,
    name: "Tech Solutions LTDA",
    cnpj: "12.345.678/0001-90",
    cndFederal: "success",
    cndEstadual: "success",
    cndMunicipal: "warning",
    fgts: "success",
    lastUpdate: "Há 2 horas"
  },
  {
    id: 2,
    name: "Comércio Rápido ME",
    cnpj: "98.765.432/0001-10",
    cndFederal: "danger",
    cndEstadual: "success",
    cndMunicipal: "success",
    fgts: "warning",
    lastUpdate: "Há 30 min"
  },
  {
    id: 3,
    name: "Indústria Nacional S/A",
    cnpj: "45.678.901/0001-23",
    cndFederal: "success",
    cndEstadual: "success",
    cndMunicipal: "success",
    fgts: "success",
    lastUpdate: "Há 1 hora"
  },
  {
    id: 4,
    name: "Serviços Premium EIRELI",
    cnpj: "67.890.123/0001-45",
    cndFederal: "warning",
    cndEstadual: "danger",
    cndMunicipal: "success",
    fgts: "success",
    lastUpdate: "Há 4 horas"
  }
];

const statusConfig = {
  success: {
    icon: FileCheck,
    color: "text-status-success",
    bg: "bg-status-success/10",
    border: "border-status-success/30"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-status-warning",
    bg: "bg-status-warning/10",
    border: "border-status-warning/30"
  },
  danger: {
    icon: XCircle,
    color: "text-status-danger",
    bg: "bg-status-danger/10",
    border: "border-status-danger/30"
  }
};

const StatusBadge = ({ status }: { status: "success" | "warning" | "danger" }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
};

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-24 relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary mb-4 block">
            Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visão completa da{" "}
            <span className="text-gradient">situação fiscal</span> dos seus clientes
          </h2>
          <p className="text-muted-foreground">
            Monitore CNDs, FGTS e pendências em tempo real com indicadores visuais claros.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-1 rounded-2xl overflow-hidden shadow-elevated">
            {/* Dashboard Header */}
            <div className="bg-secondary/50 px-6 py-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-danger" />
                  <div className="w-3 h-3 rounded-full bg-status-warning" />
                  <div className="w-3 h-3 rounded-full bg-status-success" />
                </div>
                <span className="text-sm text-muted-foreground">iaudit.allanturing.com/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 bg-background/50">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-status-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-xs text-muted-foreground">CNDs OK</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-status-warning/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-status-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-xs text-muted-foreground">Alertas</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-status-danger" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">3</p>
                      <p className="text-xs text-muted-foreground">Pendências</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">98%</p>
                      <p className="text-xs text-muted-foreground">Conformidade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Clientes Monitorados</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Ver todos
                  </Button>
                </div>
                
                {mockClients.map((client) => (
                  <div
                    key={client.id}
                    className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.cnpj}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Status Indicators */}
                      <div className="hidden md:flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">Federal</p>
                          <StatusBadge status={client.cndFederal as "success" | "warning" | "danger"} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">Estadual</p>
                          <StatusBadge status={client.cndEstadual as "success" | "warning" | "danger"} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">Municipal</p>
                          <StatusBadge status={client.cndMunicipal as "success" | "warning" | "danger"} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">FGTS</p>
                          <StatusBadge status={client.fgts as "success" | "warning" | "danger"} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {client.lastUpdate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
