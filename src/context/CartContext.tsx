"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string;
  type: "skill" | "workflow" | "bundle";
  name: string;
  price: number;
  industry: string;
  category: string;
  difficulty?: string;
  complexity?: string;
  /** For bundles: number of skills included */
  skillCount?: number;
  /** For bundles: number of workflows included */
  workflowCount?: number;
  /** Original price before discount (bundles only) */
  originalPrice?: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  itemCount: number;
  subtotal: number;
  savings: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aiskillhub-cart";

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const itemCount = items.length;

  const subtotal = Math.round(
    items.reduce((sum, item) => sum + item.price, 0) * 100
  ) / 100;

  const savings = Math.round(
    items.reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + (item.originalPrice - item.price);
      }
      return sum;
    }, 0) * 100
  ) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        itemCount,
        subtotal,
        savings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const EMPTY_CART: CartContextValue = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  isInCart: () => false,
  itemCount: 0,
  subtotal: 0,
  savings: 0,
};

export function useCart() {
  const ctx = useContext(CartContext);
  // Return empty cart during SSR/hydration if provider isn't mounted yet
  return ctx ?? EMPTY_CART;
}
