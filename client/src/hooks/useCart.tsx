import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../types/index.js';
import { api } from '../lib/api.js';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      const res = await api.post('/cart/items', { productId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        setIsBagOpen(true); // Automatically open bag preview drawer upon adding
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await api.patch('/cart/items', { productId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
