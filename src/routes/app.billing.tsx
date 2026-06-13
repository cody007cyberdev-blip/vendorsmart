import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CreditCard, Download, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
  head: () => ({ title: "Billing e Subscrições — VendorSmart" }),
});

function BillingPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "payment">("overview");

  // Dados simulados (em produção, viriam da API)
  const subscription = {
    plan: "Loja",
    price: 1000,
    currency: "CVE",
    status: "active",
    nextBillingDate: "2025-02-13",
    lastPaymentDate: "2025-01-13",
    paymentMethod: "MB WAY",
  };

  const invoices = [
    {
      id: "INV-2025-001",
      date: "2025-01-13",
      amount: 1000,
      currency: "CVE",
      status: "paid",
    },
    {
      id: "INV-2024-012",
      date: "2024-12-13",
      amount: 1000,
      currency: "CVE",
      status: "paid",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing e Subscrições</h1>
          <p className="text-gray-600 mt-2">Gerencie sua subscrição e histórico de pagamentos</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {["overview", "invoices", "payment"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "overview" && "Visão Geral"}
              {tab === "invoices" && "Faturas"}
              {tab === "payment" && "Método de Pagamento"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <Card className="p-8 border-2 border-orange-200 bg-orange-50">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Plano {subscription.plan}</h2>
                  <p className="text-gray-600 mt-2">Seu plano atual com acesso a todas as funcionalidades</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Ativo</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Preço Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.price} {subscription.currency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Próxima Faturação</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(subscription.nextBillingDate).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Último Pagamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(subscription.lastPaymentDate).toLocaleDateString("pt-PT")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Mudar de Plano
                </Button>
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-900">
                  Cancelar Subscrição
                </Button>
              </div>
            </Card>

            {/* Usage Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilização do Plano</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Utilizadores</span>
                    <span className="text-gray-900 font-semibold">3 / 5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Produtos</span>
                    <span className="text-gray-900 font-semibold">850 / 1000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{invoice.id}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(invoice.date).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {invoice.amount} {invoice.currency}
                  </p>
                  <p className="text-green-600 text-sm font-semibold">Pago</p>
                </div>
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Descarregar
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Method Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pagamento Atual</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">{subscription.paymentMethod}</p>
                  <p className="text-gray-600 text-sm">Método de pagamento ativo</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Ação Necessária</h4>
                  <p className="text-yellow-800 text-sm">
                    Seu método de pagamento expira em 30 dias. Atualize-o para evitar interrupções no serviço.
                  </p>
                </div>
              </div>
            </Card>

            <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
              Atualizar Método de Pagamento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
