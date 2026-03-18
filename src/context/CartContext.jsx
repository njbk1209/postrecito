import { createContext, useContext, useState } from 'react';
import React from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /**
   * El producto debe incluir tanto los precios en EUR como en BS
   * para que el carrito pueda mostrar el total en cualquier moneda.
   * Campos esperados: { id, name, price, compare_price, price_bs, compare_price_bs, image, stock }
   */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`😋 ¡${product.name} agregado al carrito!`);
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + amount;
          if (newQty >= 1 && newQty <= item.stock) {
            return { ...item, qty: newQty };
          }
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  // Total en euros (price)
  const totalEUR = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Total en bolívares (price_bs)
  const totalBS = cart.reduce((acc, item) => acc + ((item.price_bs ?? 0) * item.qty), 0);

  /**
   * Devuelve el total según la moneda activa.
   * Uso: getTotal('EUR') | getTotal('BS')
   */
  const getTotal = (currency) => currency === 'BS' ? totalBS : totalEUR;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalEUR, totalBS, getTotal, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);