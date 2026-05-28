import { useAuth } from "@/contexts/AuthContext";

export interface DemoContextValue {
  isDemo: boolean;
}

/**
 * Adaptador: retorna isDemo baseado no estado de autenticação.
 * Mantém compatibilidade com componentes existentes que usam useDemo.
 */
export function useDemo(): DemoContextValue {
  const { isAuthenticated } = useAuth();
  return {
    isDemo: isAuthenticated,
  };
}
