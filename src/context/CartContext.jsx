import { createContext, useContext, useState } from 'react';
import React from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Validar si al sumar uno más superamos el stock
        if (existing.qty >= product.stock) return prev; 
        return prev.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        // Validar que no sea menor a 1 y no supere el stock
        if (newQty >= 1 && newQty <= item.stock) {
          return { ...item, qty: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);