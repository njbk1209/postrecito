import { createContext, useContext, useState, useMemo } from 'react';
import React from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');
  const [products, setProducts] = useState([]);

  const isBS = currency === 'BS';

  const exchangeRate = useMemo(() => {
    const valid = products.filter(
      p => parseFloat(p.price) > 0 && parseFloat(p.price_bs) > 0
    );
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, p) => acc + parseFloat(p.price_bs) / parseFloat(p.price), 0);
    return Math.round(sum / valid.length);
  }, [products]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isBS, exchangeRate, setProducts }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);