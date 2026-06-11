import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Hammer,
  ShoppingCart,
  ShieldCheck,
  Wallet,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  RefreshCcw,
  FileText
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { 
    label: "Inventory", 
    href: "/app/catalog", 
    icon: Package,
    subItems: [
      { label: "Overview", href: "/app/catalog" },
      { label: "Stock Levels", href: "/app/stock-levels" },
      { label: "Stock Movements", href: "/app/movements" },
      { label: "Valuation", href: "/app/valuation" },
      { label: "Reorder Planning", href: "/app/reorder" },
    ]
  },
  { label: "Production (BOM)", href: "/app/production", icon: Hammer },
  { label: "Purchasing", href: "/app/purchase-orders", icon: ShoppingCart },
  { label: "Sales & Orders", href: "/app/sales", icon: ShieldCheck },
  { label: "Fiscal (SAF-T PT)", href: "/app/fiscal", icon: FileText },
  { label: "Financials", href: "/app/financials", icon: Wallet },
  { label: "CRM", href: "/app/crm", icon: Users },
  { label: "Reports & BI", href: "/app/analytics", icon: BarChart3 },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "Inventory": true });

  const isActive = (href: string) => location.pathname === href;

  return (
    <TooltipProvider delayDuration={0}>
      <nav className={cn(
        "flex h-full flex-col bg-[#1A1A1A] text-white shrink-0 border-r border-white/5 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
      )}>
        {/* Brand Logo Section */}
        <div className={cn(
          "h-16 flex items-center mb-4 transition-all duration-300",
          collapsed ? "justify-center px-0" : "gap-3 px-6"
        )}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-black tracking-tighter uppercase animate-in fade-in duration-500">VendorSmart</span>}
        </div>

        {/* Navigation Items Organized as Image */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expanded[item.label];

            return (
              <div key={item.label} className="space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group relative",
                        collapsed ? "justify-center px-0" : "justify-between px-3",
                        isActive(item.href)
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                      onClick={(e) => {
                        if (hasSubItems && !collapsed) {
                          e.preventDefault();
                          setExpanded(prev => ({ ...prev, [item.label]: !prev[item.label] }));
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive(item.href) ? "text-white" : "text-white/40")} />
                        {!collapsed && <span className="animate-in fade-in duration-500">{item.label}</span>}
                      </div>
                      {!collapsed && hasSubItems && (
                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isExpanded ? "rotate-0" : "-rotate-90")} />
                      )}
                      {collapsed && isActive(item.href) && (
                        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="bg-orange-500 text-white border-none font-bold text-[10px] uppercase tracking-widest">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>

                {!collapsed && hasSubItems && isExpanded && (
                  <div className="ml-9 space-y-1 py-1 border-l border-white/10 animate-in slide-in-from-left-2 duration-300">
                    {item.subItems!.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className={cn(
                          "block px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                          isActive(sub.href)
                            ? "text-orange-500"
                            : "text-white/40 hover:text-white"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors",
                collapsed ? "justify-center px-0" : "px-3"
              )}>
                <RefreshCcw className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="animate-in fade-in duration-500">Switch Company</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="text-[10px] font-bold uppercase tracking-widest">
                Switch Company
              </TooltipContent>
            )}
          </Tooltip>
          
          {!collapsed && (
            <div className="bg-white/5 rounded-xl p-4 animate-in fade-in duration-500">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">VendorSmart, Lda.</span>
                <span className="text-[9px] font-bold text-white/20 uppercase">NIF: 515 999 988</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
}
