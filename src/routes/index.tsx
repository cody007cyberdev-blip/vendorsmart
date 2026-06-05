import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDemo } from "@/hooks/useDemo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";
import {
  Package,
  BarChart3,
  Bell,
  Truck,
  ScanLine,
  TrendingUp,
  Users,
  ArrowRight,
  Shield,
  Globe,
  Zap,
  Menu,
  X,
} from "lucide-react";
import heroBox3d from "@/assets/hero-box.png";
import uiScreenshot from "@/assets/ui-screenshot-dashboard-v2.png.asset.json";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "VendorSmart — Centro de Comando de Inventário" },
      {
        name: "description",
        content:
          "Gestão de inventário em tempo real para empresas de qualquer dimensão. Rastreie stock, gira fornecedores, automatize reabastecimentos e mantenha a sua equipa alinhada.",
      },
      { property: "og:title", content: "VendorSmart — Centro de Comando de Inventário" },
      {
        property: "og:description",
        content:
          "Gestão de inventário em tempo real para empresas de qualquer dimensão. Rastreie stock, gira fornecedores, automatize reabastecimentos e mantenha a sua equipa alinhada."
      },
    ],
  }),
});

/* ─── Data ──────────────────────────────────────────── */
const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Soluções", href: "#solutions" },
  { label: "Análises", href: "#analytics" },
];

const solutions = [
  {
    icon: BarChart3,
    title: "Rastreamento em tempo real",
    description: "Monitorize os níveis de stock em todas as localizações com dashboards em tempo real e atualizações de estado instantâneas."
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bell,
    title: "Reabastecimentos inteligentes",
    description: "Limiares automatizados e previsão impulsionada por IA previnem rupturas de stock antes que aconteçam."
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Truck,
    title: "Gestão de fornecedores",
    description: "Visão unificada de contactos, prazos de entrega, histórico de compras e pontuação de desempenho."
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: TrendingUp,
    title: "Análises e relatórios",
    description: "Transforme dados de movimentação em insights com gráficos de tendências, análise de rotatividade e exportações."
    color: "bg-primary/10 text-primary",
  },
];

const featureTabs = [
  {
    label: "Painel",
    description: "Veja o que mais importa: níveis de stock, pedidos pendentes, movimentações recentes e alertas que precisam de atenção."
    image: uiScreenshot.url,
  },
  {
    label: "Catálogo",
    description: "Pesquisa poderosa, filtros, ações em massa e campos personalizados permitem gerir centenas de SKUs sem esforço."
    image: uiScreenshot.url,
  },
  {
    label: "Análises",
    description: "De tendências de stock a desempenho de fornecedores, transforme dados brutos em insights acionáveis e previsões."
    image: uiScreenshot.url,
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Rastreamento em tempo real",
    description: "Monitorize os níveis de stock em todas as localizações à medida que as mudanças acontecem, com dashboards instantâneos e indicadores de estado em tempo real."
  },
  {
    icon: Bell,
    title: "Alertas de reabastecimento inteligentes",
    description: "Seja notificado antes que o stock acabe. Limiares automatizados e previsão impulsionada por IA mantêm as prateleiras abastecidas."
  },
  {
    icon: Truck,
    title: "Gestão de fornecedores",
    description: "Organize contactos, prazos de entrega e histórico de compras numa visão unificada com pontuação de desempenho."
  },
  {
    icon: ScanLine,
    title: "Leitura de códigos de barras",
    description: "Acelere o recebimento e as contagens cíclicas com suporte a código de barras integrado e modo de entrada rápida."
  },
  {
    icon: TrendingUp,
    title: "Análises e relatórios",
    description: "Transforme dados de movimentação em insights com gráficos de tendências, análise de rotatividade e relatórios exportáveis."
  },
  {
    icon: Users,
    title: "Funções e permissões da equipa",
    description: "Controle quem pode visualizar, editar ou aprovar com acesso granular baseado em funções e fluxos de trabalho de aprovação."
  },
];

const capabilities = [
  { icon: Shield, text: "Acesso baseado em funções" },
  { icon: Globe, text: "Suporte a múltiplas localizações" },
  { icon: ScanLine, text: "Pronto para código de barras" },
  { icon: Zap, text: "Insights impulsionados por IA" },
];

/* ─── Components ────────────────────────────────────── */

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function StickyNav({ onTryDemo }: { onTryDemo: () => void }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 border-b border-border shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">VendorSmart</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA - Login/Signup */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-bold text-white transition-all hover:bg-gray-800 md:inline-flex"
          >
            Criar Conta
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Alternar menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="block py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onTryDemo();
            }}
            className="mt-2 w-full rounded-lg border border-border bg-muted/60 px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Experimentar demonstração
          </button>
        </div>
      )}
    </nav>
  );
}

function BrowserFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card shadow-xl ${className}`}>
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-secondary/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-stock-healthy/60" />
      </div>
      {children}
    </div>
  );
}

function FeatureTabsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="analytics" className="px-4 py-20 sm:py-28">
      <RevealSection className="text-center">
        <span className="inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Tour do produto
        </span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          Impulsione o seu negócio
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Explore os módulos que lhe dão controlo total sobre a sua cadeia de suprimentos.
        </p>
      </RevealSection>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Tab list */}
        <div className="flex justify-center gap-2 overflow-x-auto lg:w-80 lg:shrink-0 lg:justify-start lg:flex-col lg:gap-3">
          {featureTabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`shrink-0 rounded-lg px-6 py-3 text-left text-sm font-medium transition-all lg:px-6 lg:py-4 ${
                activeTab === i
                  ? "bg-white text-foreground shadow-md ring-1 ring-border"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="block font-semibold">{tab.label}</span>
              <span
                className={`mt-1 hidden text-xs leading-relaxed lg:block text-muted-foreground`}
              >
                {tab.description}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1">
          <BrowserFrame>
            <img
              src={featureTabs[activeTab].image}
              alt={`VendorSmart ${featureTabs[activeTab].label} vista`}
              className="w-full transition-opacity duration-300"
            />
          </BrowserFrame>
          <p className="mt-4 text-sm text-muted-foreground lg:hidden">
            {featureTabs[activeTab].description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
function LandingPage() {
  const { enterDemoMode } = useDemo();
  const navigate = useNavigate();

  const handleTryDemo = () => {
    enterDemoMode();
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNav onTryDemo={handleTryDemo} />

      {/* ── Split Hero ─────────────────────────────────── */}
      <section className="relative px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
            <img
              src={heroBox3d}
              alt="Ilustração 3D de uma caixa de cartão"
              className="mx-auto w-48 drop-shadow-xl sm:w-56"
            />
          </div>

          <h1 className="mt-5 text-[32px] font-black leading-[1.05] tracking-tight sm:text-[44px] lg:text-[64px] uppercase">
            Gestão de Inventário <br /> <span className="text-gray-400">Sem Complicações</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg font-medium">
            Controle stock, gira fornecedores e automatize encomendas a partir de um centro de comando inteligente e intuitivo.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="group inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:bg-gray-800"
            >
              Começar Agora
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={handleTryDemo}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-600 transition-all hover:bg-gray-50"
            >
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Soluções Grid ─────────────────────────────── */}
      <section id="solutions" className="rounded-none bg-muted/50 px-4 py-20 sm:py-28">
        <RevealSection className="text-center">
          <span className="inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Soluções
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Construído para equipas de inventário modernas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Quatro módulos poderosos a trabalhar em conjunto para lhe dar visibilidade e controlo completos.
          </p>
        </RevealSection>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s, i) => (
            <RevealSection key={s.title} delay={i * 100} className="h-full">
              <div className="group h-full rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className={`mb-4 inline-flex rounded-lg p-3 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-sm font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Product Showcase — Browser Frame ────────────── */}
      <section className="px-4 py-16">
        <RevealSection>
          <div className="mx-auto max-w-5xl">
            <BrowserFrame className="shadow-2xl shadow-primary/5">
              <img
                src={uiScreenshot.url}
                alt="Painel do VendorSmart mostrando métricas de inventário, gráfico de níveis de stock e atividade recente"
                className="w-full"
                loading="lazy"
              />
            </BrowserFrame>
          </div>
        </RevealSection>
      </section>

      {/* ── Feature Tabs ───────────────────────────────── */}
      <FeatureTabsSection />

      {/* ── Feature Grid ─────────────────────────────── */}
      <section id="features" className="px-4 py-20 sm:py-28">
        <RevealSection className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tudo o que precisa para gerir o inventário
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Seis módulos poderosos a trabalhar em conjunto para lhe dar controlo total sobre a sua cadeia de suprimentos.
          </p>
        </RevealSection>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 80}>
              <div className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-md bg-primary p-2.5">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-sm font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Capabilities Row ─────────────────────────── */}
      <section className="px-4 py-20">
        <RevealSection>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {capabilities.map((c) => (
              <div
                key={c.text}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{c.text}</span>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl rounded-2xl bg-foreground px-6 py-16 text-center sm:px-12 sm:py-20">
          <RevealSection>
            <img src={heroBox3d} alt="" className="mx-auto mb-6 h-16 w-16 object-contain" />
            <h2 className="text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl">
              Pronto para assumir o controlo do seu inventário?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-background/60">
              Explore o VendorSmart com dados de exemplo. Não é necessário registo.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={handleTryDemo}
                className="group inline-flex items-center gap-2 rounded-lg bg-background px-5 py-2.5 text-base font-semibold text-foreground shadow-lg transition-all hover:bg-background/90"
              >
                Experimentar demonstração
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-10 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          <span>Construído com VendorSmart · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
