import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, BarChart3, Users, Lock, Zap, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({ title: "VendorSmart Professional Enterprise — Gestão de Inventário de Elite" }),
});

function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Atualizar estado de scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ─── Navigation Bar ─────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 text-white p-2 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">VendorSmart</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link to="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold leading-tight text-gray-900">
            Gestão de Inventário <br /> <span className="text-orange-600">Profissional</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A solução ERP completa para empresas em Portugal e Cabo Verde. Controle stock, produção, finanças e conformidade fiscal tudo num único sistema.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg">
              <Link to="/register">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 rounded-lg">
              <Link to="/app/dashboard">
                Ver Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Funcionalidades Profissionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: "Dashboard em Tempo Real", desc: "Métricas e KPIs atualizados instantaneamente." },
              { icon: Package, title: "Gestão de Inventário", desc: "Controle completo de stock, lotes e movimentos." },
              { icon: Users, title: "Gestão de Equipa", desc: "Crie funcionários, atribua cargos e permissões." },
              { icon: Lock, title: "Segurança de Elite", desc: "Autenticação JWT, 2FA e controlo de acesso granular." },
              { icon: Zap, title: "Conformidade Fiscal", desc: "SAF-T PT, IVA automático e localização PT/CV." },
              { icon: CheckCircle, title: "Exportação Profissional", desc: "CSV, PDF e XML com qualidade de impressão 300 DPI." },
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-orange-300">
                <feature.icon className="h-10 w-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Onboarding Section ────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-bold text-gray-900">Comece em Minutos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Crie sua Empresa", desc: "Registe a sua empresa com dados fiscais reais (NIF, Morada)." },
              { step: "2", title: "Adicione Funcionários", desc: "Crie contas para a sua equipa com cargos e permissões específicas." },
              { step: "3", title: "Comece a Gerir", desc: "Aceda ao dashboard e comece a otimizar seu inventário." },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Pronto para Transformar sua Gestão?</h2>
          <p className="text-xl opacity-90">Junte-se a centenas de empresas que já confiam no VendorSmart.</p>
          <Button asChild className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold">
            <Link to="/register">
              Criar Conta Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 VendorSmart, Lda. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Portugal | Cabo Verde</p>
        </div>
      </footer>
    </div>
  );
}
