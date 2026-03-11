"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  branch?: string;
  branch_name?: string;
  category_name?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        toast.success(`${product.name} quantity updated`);
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) toast.success(`${item.name} removed from cart`);
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
