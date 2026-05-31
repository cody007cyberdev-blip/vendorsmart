import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, ShoppingBag, Truck, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard/manager-dashboard")({
  component: () => (
    <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
      <ManagerDashboard />
    </ProtectedRoute>
  ),
});

function ManagerDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Painel de Gestão</h1>
          <p className="text-gray-500">Visão estratégica e operacional do negócio.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Últimos 30 dias
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Vendas Totais", value: "€45.280", icon: TrendingUp, color: "text-green-600" },
          { label: "Novos Clientes", value: "342", icon: ShoppingBag, color: "text-blue-600" },
          { label: "Encomendas Pendentes", value: "18", icon: Truck, color: "text-orange-600" },
          { label: "Margem Média", value: "24.5%", icon: BarChart3, color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-gray-50 shadow-none">
            <CardContent className="pt-6">
              <div className={`p-2 w-fit rounded-lg bg-white mb-4 shadow-sm ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-2 border-gray-100">
          <CardHeader>
            <CardTitle>Desempenho de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-bold italic">
              [Gráfico de Vendas Real-time]
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100">
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Produto Exemplo {i}</p>
                  <p className="text-xs text-gray-500">120 unidades vendidas</p>
                </div>
                <p className="text-sm font-black">€1.200</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
