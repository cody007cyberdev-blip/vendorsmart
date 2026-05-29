import { createContext, useMemo, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPermissionsForRole, type RolePermissions, type UserRoleType } from "@/lib/roles";

export interface RoleContextValue {
  role: UserRoleType;
  permissions: RolePermissions;
  isAdmin: boolean;
  isManager: boolean;
  isRequestor: boolean;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

/**
 * RoleProvider agora é um wrapper que lê do AuthContext.
 * Mantém compatibilidade com componentes que usam useRole().
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { role: authRole } = useAuth();

  // Mapeia roles do backend para roles do frontend
  const mapRole = (authRole: string | null): UserRoleType => {
    if (authRole === "admin") return "admin";
    if (authRole === "manager") return "manager";
    return "requestor"; // vendor e customer mapeiam para requestor
  };

  const role = mapRole(authRole);

  const value = useMemo<RoleContextValue>(() => {
    const permissions = getPermissionsForRole(role);
    return {
      role,
      permissions,
      isAdmin: role === "admin",
      isManager: role === "manager",
      isRequestor: role === "requestor",
    };
  }, [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
