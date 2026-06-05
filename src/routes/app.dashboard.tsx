import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardReorderSection } from "@/components/insights/DashboardReorderSection";
import { DashboardAnomalySection } from "@/components/insights/DashboardAnomalySection";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

import { useStockSummary } from "@/hooks/useInventoryData";
import { useAlertGenerator } from "@/hooks/useStockAlertGenerator";
import { useDemo } from "@/hooks/useDemo";
import { useOnboarding, type TourStep } from "@/hooks/useOnboarding";

const TOUR_STEPS: TourStep[] = [
  { title: "Bem-vindo ao Stackwise!", description: "Vamos fazer um tour rápido pelas principais funcionalidades. Isso levará apenas um minuto." },
  { target: "sidebar", title: "Navegação", description: "Use a barra lateral para alternar entre as seções — catálogo, movimentos, fornecedores e muito mais." },
  { target: "metrics", title: "Saúde do estoque", description: "A saúde do seu inventário em um relance — SKUs totais, em estoque, com pouco estoque e fora de estoque." },
  { target: "needs-attention", title: "Precisa de atenção", description: "Itens que precisam de ação aparecem aqui — baixo estoque, pedidos de compra atrasados e solicitações pendentes." },
  { target: "search", title: "Paleta de comandos", description: "Pressione CMD+K (ou Ctrl+K) para pesquisar qualquer coisa — itens, fornecedores, pedidos e muito mais." },
  { title: "Tudo pronto!", description: "Explore o aplicativo ou experimente o passo a passo guiado para aprender o fluxo de trabalho principal. Boa gestão!" },
];

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Painel — Stackwise" }] }),
});

function DashboardPage() {
  const { data: summary } = useStockSummary();
  const { demoStore, isDemo } = useDemo();
  useAlertGenerator();

  const items = demoStore?.getItems() ?? [];
  const movements = demoStore?.getMovements() ?? [];
  const suppliers = demoStore?.getSuppliers() ?? [];

  const tour = useOnboarding("dashboard");
  

  // Auto-start tour on first demo visit
  useEffect(() => {
    if (isDemo && !tour.hasCompleted) {
      const timer = setTimeout(() => tour.startTour(), 500);
      return () => clearTimeout(timer);
    }
  }, [isDemo, tour.hasCompleted]);

  const handleTourComplete = () => {
    tour.completeTour();
    toast.success("Tour completo! Explore livremente ou inicie o passo a passo.");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">Bem-vindo de volta — aqui está a sua visão geral do inventário.</p>
      </div>

      <div data-tour="metrics" className="rounded-xl border border-border bg-card p-3 shadow-xs">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total de SKUs" value={summary.total} accentColor="neutral" icon={Package} />
          <MetricCard label="Em estoque" value={summary.inStock} accentColor="healthy" icon={CheckCircle2} />
          <MetricCard label="Baixo estoque" value={summary.lowStock} accentColor="warning" icon={AlertTriangle} />
          <MetricCard label="Fora de estoque" value={summary.outOfStock} accentColor="danger" icon={XCircle} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div data-tour="needs-attention" className="min-h-0"><NeedsAttention /></div>
        <div className="min-h-0"><RecentActivity /></div>
      </div>

      <DashboardAnomalySection movements={movements} items={items} />
      <DashboardReorderSection items={items} movements={movements} suppliers={suppliers} />

      <OnboardingTour
        steps={TOUR_STEPS}
        currentStep={tour.currentStep}
        isActive={tour.isActive}
        onNext={tour.next}
        onBack={tour.back}
        onSkip={tour.skipTour}
        onComplete={handleTourComplete}
      />

      
    </div>
  );
}
