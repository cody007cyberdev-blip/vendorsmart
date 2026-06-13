import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Interface de Contexto de Tenant
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  userRole: "admin" | "manager" | "vendor" | "employee" | "customer";
  companyName: string;
  country: "PT" | "CV";
  currency: "EUR" | "CVE";
}

/**
 * Hook para obter o contexto de tenant do utilizador logado
 */
export function useTenant() {
  const [tenant, setTenant] = useState<TenantContext | null>(null);

  useEffect(() => {
    // Obtém o contexto de tenant do localStorage (armazenado após login)
    const storedTenant = localStorage.getItem("tenant");
    if (storedTenant) {
      try {
        setTenant(JSON.parse(storedTenant));
      } catch (err) {
        console.error("Erro ao carregar contexto de tenant:", err);
      }
    }
  }, []);

  return tenant;
}

/**
 * Hook para obter dados filtrados por tenant
 * Automaticamente adiciona o tenantId aos parâmetros da query
 */
export function useTenantQuery<T>(
  key: string[],
  url: string,
  options?: any
) {
  const tenant = useTenant();

  const { data, isLoading, error } = useQuery({
    queryKey: [...key, tenant?.tenantId],
    queryFn: async () => {
      const response = await fetch(`${url}?tenantId=${tenant?.tenantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.status}`);
      }

      return response.json() as Promise<T>;
    },
    enabled: !!tenant, // Só executa se o tenant está disponível
    ...options,
  });

  return { data, isLoading, error, tenant };
}

/**
 * Hook para fazer mutações (POST, PUT, DELETE) com contexto de tenant
 */
export function useTenantMutation(
  method: "POST" | "PUT" | "DELETE",
  url: string
) {
  const tenant = useTenant();

  const mutate = async (payload?: any) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...payload,
        tenantId: tenant?.tenantId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na operação: ${response.status}`);
    }

    return response.json();
  };

  return { mutate, tenant };
}

/**
 * Hook para verificar permissões do utilizador
 */
export function usePermission() {
  const tenant = useTenant();

  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!tenant) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(tenant.userRole);
  };

  const isAdmin = () => tenant?.userRole === "admin";
  const isManager = () => tenant?.userRole === "manager" || isAdmin();
  const isVendor = () => ["vendor", "manager", "admin"].includes(tenant?.userRole || "");

  return { hasPermission, isAdmin, isManager, isVendor };
}
