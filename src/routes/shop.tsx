import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type ShoppingList, type ShoppingListItem, type Product } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, QrCode, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Loja — VendorSmart" }],
  }),
});

interface SearchParams {
  token?: string;
}

function ShopPage() {
  const search = useSearch({ from: "/shop" }) as SearchParams;
  const navigate = useNavigate();

  const [step, setStep] = useState<"create" | "list">(search.token ? "list" : "create");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // List state
  const [list, setList] = useState<ShoppingList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Carregar lista existente
  useEffect(() => {
    if (search.token) {
      loadList(search.token);
    }
  }, [search.token]);

  const loadList = async (token: string) => {
    try {
      const data = await api.get<ShoppingList>(`/api/shopping/lists/by-token/${token}`);
      setList(data);
      setStep("list");
    } catch (err) {
      toast.error("Lista nao encontrada");
      setStep("create");
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.get<Product[]>("/api/products");
      setProducts(data);
    } catch (err) {
      toast.error("Erro ao carregar produtos");
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      toast.error("Insira seu nome");
      return;
    }

    setLoading(true);
    try {
      const newList = await api.post<ShoppingList>("/api/shopping/lists", {
        customerName,
        customerPhone,
      });
      setList(newList);
      await loadProducts();
      setStep("list");
      navigate({ search: { token: newList.publicToken } as never });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar lista");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list || !selectedProductId || quantity < 1) {
      toast.error("Selecione um produto e quantidade");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    setLoading(true);
    try {
      await api.post(`/api/shopping/lists/by-token/${list.publicToken}/items`, {
        productId: selectedProductId,
        productName: product.name,
        quantity,
      });
      await loadList(list.publicToken);
      setSelectedProductId("");
      setQuantity(1);
      toast.success("Item adicionado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar item");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!list) return;
    try {
      await api.delete(`/api/shopping/lists/by-token/${list.publicToken}/items/${itemId}`);
      await loadList(list.publicToken);
      toast.success("Item removido");
    } catch (err) {
      toast.error("Erro ao remover item");
    }
  };

  const handleMarkReady = async () => {
    if (!list) return;
    try {
      await api.put(`/api/shopping/lists/${list.id}`, { status: "ready" });
      await loadList(list.publicToken);
      toast.success("Lista marcada como pronta!");
    } catch (err) {
      toast.error("Erro ao atualizar lista");
    }
  };

  if (step === "create") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Criar Lista de Compras
            </CardTitle>
            <CardDescription>Comece sua lista de compras sem necessidade de aplicacao</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Seu Nome</Label>
                <Input
                  id="name"
                  placeholder="Joao Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Criar Lista
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const total = list.items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Sua Lista de Compras</h1>
          <p className="mt-2 text-slate-600">{list.customerName}</p>
        </div>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Codigo QR
            </CardTitle>
            <CardDescription>Mostre este codigo ao vendedor para processar sua compra</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="rounded-lg bg-white p-4">
              <div id="qrcode-placeholder" className="h-48 w-48 bg-slate-100 flex items-center justify-center">
                <span className="text-sm text-slate-500">QR Code sera gerado aqui</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Item */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="product">Produto</Label>
                  <select
                    id="product"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — €{p.sellingPrice.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantidade</Label>
                  <Input
                    id="qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens ({list.items?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!list.items || list.items.length === 0 ? (
              <p className="text-center text-slate-500">Nenhum item adicionado ainda</p>
            ) : (
              <div className="space-y-3">
                {list.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-600">
                        {item.quantity}x €{item.unitPrice.toFixed(2)} = €{(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <p className="text-lg font-bold text-slate-900">Total: €{total.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("create")}>
            Nova Lista
          </Button>
          <Button className="flex-1" onClick={handleMarkReady} disabled={!list.items || list.items.length === 0}>
            Marcar Pronta
          </Button>
        </div>
      </div>
    </div>
  );
}
