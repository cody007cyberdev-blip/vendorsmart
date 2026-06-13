import { useTenant } from "@/hooks/useTenant";
import { AdminDashboard } from "./AdminDashboard";
import { VendorDashboard } from "./VendorDashboard";
import { ManagerDashboard } from "./ManagerDashboard";

/**
 * Componente que renderiza o dashboard específico baseado no cargo do utilizador
 */
export function RoleBasedDashboard() {
  const tenant = useTenant();

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  switch (tenant.userRole) {
    case "admin":
      return <AdminDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "vendor":
      return <VendorDashboard />;
    case "employee":
      return <VendorDashboard />; // Funcionários usam visão de vendedor por defeito
    default:
      return <VendorDashboard />;
  }
}
