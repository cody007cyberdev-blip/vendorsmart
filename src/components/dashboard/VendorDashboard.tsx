import { Card } from "@/components/ui/card";
import { ShoppingCart, Package, TrendingUp, Clock } from "lucide-react";

export function VendorDashboard() {
  const stats = [
    { title: "Vendas Hoje", value: "€ 450.00", icon: ShoppingCart, color: "text-blue-600" },
    { title: "Produtos em Stock", value: "1,240", icon: Package, color: "text-orange-600" },
    { title: "Meta Diária", value: "85%", icon: TrendingUp, color: "text-green-600" },
    { title: "Última Venda", value: "Há 5 min", icon: Clock, color: "text-purple-600" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel do Vendedor</h1>
        <p className="text-gray-600">Visão rápida das suas operações diárias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vendas Recentes</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">Venda #1234{i}</p>
                  <p className="text-xs text-gray-500">Há {i * 10} minutos</p>
                </div>
                <p className="font-bold text-green-600">€ {(Math.random() * 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Stock Crítico</h3>
          <div className="space-y-4">
            {["Água 1.5L", "Arroz 1kg", "Leite UHT", "Açúcar"].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <p className="font-medium">{item}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{Math.floor(Math.random() * 10)} unid.</p>
                  <p className="text-xs text-gray-500">Mín: 20</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
