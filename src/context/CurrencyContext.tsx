import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserCurrency } from '../types';
import { getCurrencyName } from '../data/exchangeRates';

interface CurrencyContextType {
  currency: UserCurrency;
  setCurrency: (currency: UserCurrency) => void;
  currencyNames: Record<UserCurrency, string>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<UserCurrency>('EUR');

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency') as UserCurrency;
    if (storedCurrency && ['EUR', 'USD', 'GBP', 'CNY', 'AED'].includes(storedCurrency)) {
      setCurrency(storedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency: UserCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const currencyNames: Record<UserCurrency, string> = {
    CNY: getCurrencyName('CNY'),
    EUR: getCurrencyName('EUR'),
    USD: getCurrencyName('USD'),
    GBP: getCurrencyName('GBP'),
    AED: getCurrencyName('AED'),
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency, currencyNames }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};