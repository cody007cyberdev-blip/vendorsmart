import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, User, Package, CreditCard, Trash2, Plus, Minus, CheckCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/vendedor-pdv")({
  component: () => (
    <ProtectedRoute allowedRoles={['VENDEDOR', 'ADMIN', 'MANAGER']}>
      <VendedorPDV />
    </ProtectedRoute>
  ),
});

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
}

function VendedorPDV() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAppStore(state => state.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get<Product[]>("/api/catalog/items");
        setProducts(data);
      } catch (error) {
        toast.error("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.barcode?.includes(searchTerm)
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Produto sem stock");
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.product.stock) {
          toast.warning("Quantidade excede o stock disponível");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulação de venda
      await api.post("/api/sales", {
        items: cart.map(i => ({ id: i.product.id, quantity: i.quantity })),
        total,
        paymentMethod: 'cash',
        vendedorId: user?.id
      });
      
      toast.success("Venda realizada com sucesso!");
      setCart([]);
    } catch (error) {
      toast.error("Erro ao processar venda");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-gray-50 overflow-hidden rounded-xl border border-gray-200">
      {/* PDV Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Terminal de Vendas (PDV)</h1>
            <p className="text-xs text-gray-400">Operador: {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total em Caixa</p>
            <p className="font-mono font-bold">€ 1.240,50</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Fechar Caixa
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Product Selection */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              className="pl-10 h-12 text-lg bg-white border-gray-200 shadow-sm"
              placeholder="Pesquisar por nome ou código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:border-black transition-all active:scale-95 bg-white border-gray-200"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="font-bold text-sm line-clamp-2 h-10">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
                        <Badge variant={product.stock > 10 ? "secondary" : "destructive"} className="text-[10px]">
                          {product.stock} un
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart / Checkout */}
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Carrinho Atual
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <ShoppingCart className="w-16 h-16 opacity-20" />
                <p>O carrinho está vazio</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">€{item.product.price.toFixed(2)} / un</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full"
                      onClick={() => updateQuantity(item.product.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full"
                      onClick={() => updateQuantity(item.product.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <p className="font-bold">€{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Impostos (IVA 23%)</span>
                <span>€{(total * 0.23).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-2 border-t border-gray-200">
                <span>TOTAL</span>
                <span>€{(total * 1.23).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-14 border-2"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
              >
                Cancelar
              </Button>
              <Button 
                className="h-14 bg-black hover:bg-gray-800 text-white font-bold text-lg shadow-lg"
                disabled={cart.length === 0 || isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? "Processando..." : "PAGAR"}
              </Button>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                <Printer className="w-3 h-3 mr-1" /> Imprimir Último Talão
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
