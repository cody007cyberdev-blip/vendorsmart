import { createFileRoute } from "@tanstack/react-router";
import { Package, Truck, FileText, Bell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard/fornecedor-dashboard")({
  component: () => (
    <ProtectedRoute allowedRoles={['FORNECEDOR', 'ADMIN']}>
      <FornecedorDashboard />
    </ProtectedRoute>
  ),
});

function FornecedorDashboard() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Portal do Fornecedor</h1>
          <p className="text-gray-500">Gerencie seus produtos e ordens de compra.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all">
          Nova Guia de Remessa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-gray-500">Encomendas em Trânsito</CardTitle>
              <div className="text-2xl font-black">5</div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-gray-500">Ordens de Compra</CardTitle>
              <div className="text-2xl font-black">12</div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-gray-500">Faturas Pagas</CardTitle>
              <div className="text-2xl font-black">€15.400</div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" /> Alertas de Stock Baixo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-red-400" />
                  <span className="font-bold text-red-900">Produto Crítico {i}</span>
                </div>
                <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-black">Stock: 2 un</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== 3 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-gray-100"></div>}
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-4 border-white z-10"></div>
                    <div>
                      <p className="text-sm font-bold">Ordem de Compra #PO-2026-00{i} recebida</p>
                      <p className="text-xs text-gray-400">Há {i * 2} horas</p>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
