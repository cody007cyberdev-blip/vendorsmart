import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN' | 'MANAGER' | 'VENDEDOR' | 'CLIENTE' | 'FORNECEDOR';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

interface AppState {
  user: User | null;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      
      setUser: (user) => set({ user }),
      
      logout: () => {
        set({ user: null, cart: [] });
        // Limpar cookies ou tokens se necessário
      },
      
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { cart: [...state.cart, item] };
      }),
      
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== itemId),
      })),
      
      updateCartQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map((i) => 
          i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
        ).filter(i => i.quantity > 0),
      })),
      
      clearCart: () => set({ cart: [] }),
    }),
    { 
      name: 'vendorsmart-storage',
      // Você pode adicionar um filtro de persistência aqui se não quiser salvar o carrinho todo
    }
  )
);
