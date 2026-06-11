import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  ClipboardList,
  Inbox,
  MapPin,
  BarChart3,
  Sparkles,
  Settings,
  ChevronRight,
  HelpCircle,
  Hammer,
  FileText,
  Wallet,
  ShieldCheck
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";
import type { RolePermissions } from "@/lib/roles";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permKey?: keyof RolePermissions;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  permKey?: keyof RolePermissions;
}

const navGroups: NavGroup[] = [
  {
    label: "Operações",
    items: [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { label: "Inventário", href: "/app/catalog", icon: Package },
      { label: "Movimentos", href: "/app/movements", icon: ArrowLeftRight, permKey: "canLogMovements" },
      { label: "Localizações", href: "/app/locations", icon: MapPin },
    ],
  },
  {
    label: "Produção & ERP",
    items: [
      { label: "Produção (BOM)", href: "/app/production", icon: Hammer },
      { label: "Fiscal (SAF-T)", href: "/app/fiscal", icon: ShieldCheck },
      { label: "Financeiro", href: "/app/financials", icon: Wallet },
    ],
  },
  {
    label: "Aquisição",
    permKey: "canManagePOs",
    items: [
      { label: "Fornecedores", href: "/app/suppliers", icon: Truck },
      { label: "Pedidos de compra", href: "/app/purchase-orders", icon: ClipboardList },
    ],
  },
  {
    label: "Inteligência",
    permKey: "canViewAnalytics",
    items: [
      { label: "Análises", href: "/app/analytics", icon: BarChart3 },
      { label: "Insights de IA", href: "/app/ai-insights", icon: Sparkles },
    ],
  },
  {
    label: "Administração",
    permKey: "canAccessSettings",
    items: [
      { label: "Configurações", href: "/app/settings", icon: Settings },
    ],
  },
];

const standaloneLinks: NavItem[] = [
  { label: "Solicitações", href: "/app/requests", icon: Inbox },
  { label: "Relatórios", href: "/app/reports", icon: FileText },
  { label: "Ajuda", href: "/app/help", icon: HelpCircle },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { permissions } = useRole();

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => location.pathname === href;

  const visibleGroups = navGroups
    .filter((g) => !g.permKey || permissions[g.permKey])
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => !i.permKey || permissions[i.permKey]),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <nav data-tour="sidebar" className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border/50 bg-sidebar-accent/10">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
          V
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tight uppercase text-sidebar-primary-foreground">VendorSmart</span>
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Enterprise v3.0</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {visibleGroups.map((group, idx) => {
          const isCollapsed = collapsed[group.label] ?? false;
          return (
            <div key={group.label} className="mb-4">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-sidebar-foreground/40 hover:text-sidebar-foreground/80 transition-colors"
              >
                <span>{group.label}</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-150", !isCollapsed && "rotate-90")} />
              </button>

              {!isCollapsed && (
                <div className="mt-1.5 space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 group",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive(item.href) ? "text-primary-foreground" : "text-primary")} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="mx-2 my-4 border-t border-sidebar-border/50" />
        <div className="space-y-0.5">
          {standaloneLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive(item.href) ? "text-primary-foreground" : "text-primary")} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">
            JA
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">João Almeida</span>
            <span className="text-[9px] text-muted-foreground uppercase font-black">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
