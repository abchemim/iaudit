import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Receipt,
  FileText,
  Mail,
  Users,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick, badge }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-primary")} />
    {!collapsed && (
      <>
        <span className="flex-1 text-left">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="bg-status-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
      </>
    )}
    {collapsed && badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-status-danger text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const mainMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "clientes", icon: Building2, label: "Clientes" },
    { id: "declaracoes", icon: FileText, label: "Declarações" },
    { id: "fgts", icon: FileCheck, label: "FGTS Digital" },
    { id: "certidoes", icon: Shield, label: "Certidões" },
    { id: "parcelamentos", icon: FolderOpen, label: "Parcelamentos" },
    { id: "simples", icon: Receipt, label: "Sublimites" },
    { id: "caixaspostais", icon: Mail, label: "Caixas Postais" },
  ];

  const bottomMenuItems = [
    { id: "usuarios", icon: Users, label: "Usuários" },
    { id: "configuracoes", icon: Settings, label: "Configurações" },
    { id: "ajuda", icon: HelpCircle, label: "Ajuda" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Button - Floating on the edge */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-5 z-50 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar-background shadow-md hover:bg-secondary"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold">
              <span className="text-foreground">IA</span>
              <span className="text-gradient">udit</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!collapsed && (
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
              MONITORAMENTO
            </p>
          )}
          {mainMenuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              collapsed={collapsed}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomMenuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            collapsed={collapsed}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
