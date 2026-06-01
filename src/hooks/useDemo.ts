import { useContext } from "react";
import { DemoContext, type DemoContextValue as DemoContextType } from "@/contexts/DemoContext";

export interface DemoContextValue extends DemoContextType {}

/**
 * Adaptador: retorna o contexto de demo.
 * Mantém compatibilidade com componentes existentes que usam useDemo.
 */
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    return {
      isDemo: false,
      demoStore: null,
      enterDemoMode: () => undefined,
      exitDemoMode: () => undefined,
      resetDemoData: () => undefined,
      bumpVersion: () => undefined,
      version: 0,
    };
  }
  return ctx;
}
