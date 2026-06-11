import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ShortcutsHelpDialog } from "@/components/command/ShortcutsHelpDialog";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/useAppStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { canAccessRoute } from "@/lib/route-guard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useKeyboardShortcuts({ onHelpOpen: () => setHelpOpen(true) });

  // Redirecionar para login quando nao autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.pathname } as never });
    }
  }, [loading, isAuthenticated, navigate, location.pathname]);

  // Guard RBAC
  useEffect(() => {
    if (user && !canAccessRoute(location.pathname, mapRole(user.role))) {
      toast.error("Nao tem permissao para aceder a esta pagina.");
      navigate({ to: "/app/dashboard" });
    }
  }, [location.pathname, user, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8F9FA]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Collapsible Logic */}
        <aside 
          className={cn(
            "hidden md:block shrink-0 transition-all duration-300 ease-in-out border-r border-white/5 bg-[#1A1A1A]",
            sidebarCollapsed ? "w-20" : "w-72"
          )}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header with Toggle Button */}
          <Header 
            sidebarCollapsed={sidebarCollapsed} 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <PageTransition routeKey={location.pathname}>
                <div className="p-0">
                  <Outlet />
                </div>
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>
      
      <BottomNav />
      <ShortcutsHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

// Mapeia role do frontend para o modelo de RBAC usado pelo route guard
function mapRole(role: string): "admin" | "manager" | "requestor" {
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "manager") return "manager";
  return "requestor";
}
