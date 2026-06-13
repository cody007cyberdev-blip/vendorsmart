import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({ title: "Planos e Preços — VendorSmart Professional Enterprise" }),
});

function PricingPage() {
  const plans = [
    {
      name: "Vendedor",
      price: "500",
      currency: "CVE",
      description: "Ideal para vendedores individuais e pequenos negócios",
      features: [
        "Até 100 produtos",
        "1 utilizador",
        "Gestão básica de inventário",
        "Relatórios simples",
        "Suporte por email",
        "Período de teste: 30 dias",
      ],
      cta: "Começar Teste Gratuito",
      highlighted: false,
    },
    {
      name: "Loja",
      price: "1000",
      currency: "CVE",
      description: "Perfeito para lojas de retalho com operações de médio porte",
      features: [
        "Até 1000 produtos",
        "Até 5 utilizadores",
        "Gestão avançada de inventário",
        "Produção (BOM)",
        "Relatórios financeiros",
        "Conformidade fiscal (SAF-T PT)",
        "Suporte por email e chat",
        "Período de teste: 30 dias",
      ],
      cta: "Começar Teste Gratuito",
      highlighted: true,
    },
    {
      name: "Minimercado/Supermercado",
      price: "1500",
      currency: "CVE",
      description: "Solução robusta para grandes superfícies comerciais",
      features: [
        "Produtos ilimitados",
        "Até 20 utilizadores",
        "Gestão completa de operações",
        "Produção avançada (BOM)",
        "Análise financeira completa",
        "Conformidade fiscal (SAF-T PT)",
        "CRM integrado",
        "Integrações externas (API)",
        "Suporte prioritário 24/7",
        "Período de teste: 30 dias",
      ],
      cta: "Começar Teste Gratuito",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Planos Transparentes e Acessíveis
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Escolha o plano que melhor se adapta ao seu negócio. Todos incluem 30 dias de teste gratuito.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 ${
                plan.highlighted
                  ? "ring-2 ring-orange-600 shadow-2xl scale-105"
                  : "border border-gray-200 shadow-lg"
              } overflow-hidden bg-white`}
            >
              {plan.highlighted && (
                <div className="bg-orange-600 text-white py-2 text-center font-semibold">
                  Mais Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.currency}/mês</span>
                </div>

                <Button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    plan.highlighted
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Perguntas Frequentes
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso mudar de plano a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Pode fazer upgrade ou downgrade do seu plano a qualquer momento. A mudança entra em vigor imediatamente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                O que acontece após os 30 dias de teste?
              </h3>
              <p className="text-gray-600">
                Após o período de teste, será necessário adicionar um método de pagamento para continuar usando o VendorSmart. Pode cancelar a qualquer momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Qual é a política de reembolso?
              </h3>
              <p className="text-gray-600">
                Oferecemos reembolso completo nos primeiros 14 dias após o pagamento. Após esse período, não há reembolsos, mas pode cancelar a sua subscrição a qualquer momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vocês oferecem planos personalizados?
              </h3>
              <p className="text-gray-600">
                Sim! Para empresas grandes com necessidades específicas, oferecemos planos Enterprise personalizados. Entre em contacto connosco para mais informações.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 text-orange-100">
            Comece com 30 dias de teste gratuito. Sem cartão de crédito necessário.
          </p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg">
            Criar Conta Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
}
