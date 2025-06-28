// store/cartStore.ts
import { create } from 'zustand';

interface CartState {
  hasCart: boolean;
  cartUpdated: boolean;
  checkCart: () => void;
  toggleCartUpdated: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  hasCart: false,
  cartUpdated: false,
  checkCart: () => {
    if (typeof window === 'undefined') return;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      set({ hasCart: cart.length > 0 });
    } catch {
      set({ hasCart: false });
    }
  },
  toggleCartUpdated: () => set((state) => ({ cartUpdated: !state.cartUpdated })),
}));
