import { createContext, useContext, useState, useMemo } from 'react';
import React from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');
  const [products, setProducts] = useState([]);

  const isBS = currency === 'BS';

  const exchangeRate = useMemo(() => {
    const parsePrice = (val) => parseFloat(String(val).replace(',', '.')) || 0;
    const valid = products.filter(
      p => parsePrice(p.price) > 0 && parsePrice(p.price_bs) > 0
    );
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, p) => {
      return acc + (parsePrice(p.price_bs) / parsePrice(p.price));
    }, 0);
    const averageRate = sum / valid.length;
    return averageRate;
  }, [products]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isBS, exchangeRate, setProducts }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);