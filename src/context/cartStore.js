import { create } from 'zustand';

const CART_STORAGE_KEY = 'item13_cart_items';

const getInitialCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      let updated;
      if (existing) {
        updated = state.items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.stock || 99, (i.quantity || 1) + (item.quantity || 1)) }
            : i
        );
      } else {
        updated = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }
      saveCart(updated);
      return { items: updated };
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock || 99, quantity)) }
          : item
      );
      saveCart(updated);
      return { items: updated };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      saveCart(updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  // Merging guest cart with user cart on login without duplicating items
  mergeCart: (incomingItems) => {
    if (!incomingItems || incomingItems.length === 0) return;
    set((state) => {
      const current = [...state.items];
      incomingItems.forEach((incoming) => {
        const idx = current.findIndex((i) => i.id === incoming.id);
        if (idx >= 0) {
          current[idx] = {
            ...current[idx],
            quantity: Math.min(
              current[idx].stock || 99,
              (current[idx].quantity || 1) + (incoming.quantity || 1)
            ),
          };
        } else {
          current.push(incoming);
        }
      });
      saveCart(current);
      return { items: current };
    });
  },
}));
