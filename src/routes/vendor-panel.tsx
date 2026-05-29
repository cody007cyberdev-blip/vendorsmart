import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type ShoppingList, type Sale } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Check, X, Eye } from "lucide-react";

export const Route = createFileRoute("/vendor-panel")({
  component: VendorPanel,
  head: () => ({
    meta: [{ title: "Painel do Vendedor — VendorSmart" }],
  }),
});

function VendorPanel() {
  const [readyLists, setReadyLists] = useState<ShoppingList[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh a cada 10s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [lists, sales] = await Promise.all([
        api.get<ShoppingList[]>("/api/shopping/lists?status=ready"),
        api.get<Sale[]>("/api/sales?limit=10"),
      ]);
      setReadyLists(lists);
      setRecentSales(sales);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSale = async (list: ShoppingList) => {
    if (!list.items || list.items.length === 0) {
      toast.error("Lista vazia");
      return;
    }

    try {
      const total = list.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      await api.post("/api/sales", {
        shoppingListId: list.id,
        itemsJson: JSON.stringify(list.items),
        subtotal: total,
        discount: 0,
        total,
        paymentMethod: "cash",
        notes: `Cliente: ${list.customerName}`,
      });
      toast.success("Venda processada com sucesso!");
      await loadData();
      setSelectedList(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar venda");
    }
  };

  const handleCancelList = async (list: ShoppingList) => {
    try {
      await api.put(`/api/shopping/lists/${list.id}`, { status: "cancelled" });
      toast.success("Lista cancelada");
      await loadData();
    } catch (err) {
      toast.error("Erro ao cancelar lista");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel do Vendedor</h1>
          <p className="mt-1 text-slate-600">Processe listas de compras e vendas em tempo real</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main: Ready Lists */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listas Prontas para Processamento</CardTitle>
                <CardDescription>{readyLists.length} lista(s) aguardando</CardDescription>
              </CardHeader>
              <CardContent>
                {readyLists.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Nenhuma lista pronta</p>
                ) : (
                  <div className="space-y-3">
                    {readyLists.map((list) => (
                      <div
                        key={list.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{list.customerName}</h3>
                            <p className="text-sm text-slate-600">
                              {list.customerPhone && `Tel: ${list.customerPhone}`}
                            </p>
                            <p className="mt-2 text-sm text-slate-700">
                              <strong>{list.items?.length || 0}</strong> item(ns) •{" "}
                              <strong>
                                €
                                {(list.items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0).toFixed(2)}
                              </strong>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedList(list)}
                              className="gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleProcessSale(list)}
                              className="gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Processar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelList(list)}
                              className="gap-1"
                            >
                              <X className="h-4 w-4" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Recent Sales */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSales.length === 0 ? (
                  <p className="text-center text-slate-500 py-4 text-sm">Nenhuma venda</p>
                ) : (
                  <div className="space-y-3">
                    {recentSales.map((sale) => (
                      <div key={sale.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                        <p className="font-medium text-slate-900">{sale.saleNumber}</p>
                        <p className="text-slate-600">€{sale.total.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(sale.createdAt).toLocaleString("pt-PT")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{selectedList.customerName}</CardTitle>
                <CardDescription>Detalhes da lista</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedList.items && selectedList.items.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedList.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.productName}</span>
                        <span className="font-medium">
                          {item.quantity}x €{item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-bold">
                      Total: €
                      {(selectedList.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Nenhum item</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedList(null)}>
                    Fechar
                  </Button>
                  <Button className="flex-1" onClick={() => handleProcessSale(selectedList)}>
                    Processar Venda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
