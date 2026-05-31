import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, Filter, Star, Clock, ChevronRight, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/cliente-loja")({
  component: () => (
    <ProtectedRoute allowedRoles={['CLIENTE', 'ADMIN', 'MANAGER']}>
      <ClienteLoja />
    </ProtectedRoute>
  ),
});

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
  rating?: number;
}

function ClienteLoja() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useAppStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get<Product[]>("/api/catalog/items");
        setProducts(data);
      } catch (error) {
        toast.error("Erro ao carregar catálogo");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-8 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/20 px-4 py-1">
              Nova Coleção 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              QUALIDADE QUE <br /> VOCÊ MERECE.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium">
              Explore o nosso catálogo exclusivo com os melhores produtos do mercado, 
              entregues diretamente na sua porta com segurança e rapidez.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button className="bg-white text-black hover:bg-gray-200 h-12 px-8 font-bold rounded-full">
                Ver Promoções
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 font-bold rounded-full">
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="w-80 h-80 bg-white/5 rounded-full absolute -top-10 -right-10 blur-3xl"></div>
            <div className="relative z-10 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              <ShoppingBag className="w-48 h-48 text-white opacity-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-24">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              className="pl-12 h-14 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-black"
              placeholder="O que você procura hoje?"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" className="rounded-xl h-12 gap-2 border-gray-200">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-white shadow-sm rounded-lg">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400">
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {['Todos', 'Alimentação', 'Bebidas', 'Higiene', 'Limpeza', 'Electrónica', 'Casa'].map((cat, i) => (
            <Button 
              key={cat} 
              variant={i === 0 ? "default" : "outline"} 
              className={`rounded-full px-8 h-11 font-bold whitespace-nowrap ${i === 0 ? 'bg-black text-white' : 'border-gray-200 text-gray-600'}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-3xl"></div>
                <div className="h-6 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="group relative">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <ShoppingBag className="w-20 h-20" />
                    </div>
                  )}
                  <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300">
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="absolute inset-x-6 bottom-6 translate-y-12 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <Button 
                      className="w-full h-14 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800"
                      onClick={() => handleAddToCart(product)}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold">{product.rating || 4.8}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-black">€{product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through font-medium">€{(product.price * 1.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Banner */}
        <div className="mt-24 bg-gray-50 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="relative z-10 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              FRETE GRÁTIS EM <br /> COMPRAS ACIMA DE €50
            </h2>
            <p className="text-gray-500 text-lg font-medium max-w-md">
              Aproveite a nossa oferta especial por tempo limitado. 
              Entrega rápida e segura para todo o país.
            </p>
            <Button className="bg-black text-white hover:bg-gray-800 h-14 px-10 font-bold rounded-2xl shadow-lg">
              Comprar Agora <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="md:absolute md:-right-20 md:-bottom-20 opacity-10 md:opacity-20">
            <Clock className="w-96 h-96 text-black" />
          </div>
        </div>
      </div>
      
      {/* Floating Cart Button (Mobile) */}
      <div className="fixed bottom-8 right-8 lg:hidden z-50">
        <Button className="h-16 w-16 rounded-full bg-black text-white shadow-2xl relative">
          <ShoppingBag className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-6 w-6 rounded-full flex items-center justify-center border-4 border-white">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
