// context/CurrencyContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

const CurrencyContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency]       = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);

  const isBS = currency === 'BS';

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/exchange/get-exchange/`);
        const data = await res.json();
        setExchangeRate(data.rate);
      } catch (err) {
        console.error('Error al obtener tasa de cambio:', err);
      }
    };
    fetchRate();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isBS, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);