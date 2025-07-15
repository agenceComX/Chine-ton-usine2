import { ExchangeRates, UserCurrency } from '../types';

// Exchange rates relative to CNY (Chinese Yuan)
export const exchangeRates: ExchangeRates = {
  CNY: 1.00,   // Base currency
  EUR: 0.13,   // 1 CNY = 0.13 EUR
  USD: 0.14,   // 1 CNY = 0.14 USD
  GBP: 0.11,   // 1 CNY = 0.11 GBP
  AED: 0.51,   // 1 CNY = 0.51 AED
};

export const currencySymbols: Record<UserCurrency, string> = {
  CNY: '¥',
  EUR: '€',
  USD: '$',
  GBP: '£',
  AED: 'د.إ',
};

// Convert price from CNY to target currency
export const convertCurrency = (
  amount: number, 
  targetCurrency: UserCurrency = 'EUR'
): number => {
  if (targetCurrency === 'CNY') return amount;
  return parseFloat((amount * exchangeRates[targetCurrency]).toFixed(2));
};

// Convert price from any currency back to CNY (for filtering purposes)
export const convertToCNY = (
  amount: number, 
  fromCurrency: UserCurrency = 'EUR'
): number => {
  if (fromCurrency === 'CNY') return amount;
  // Divide by the exchange rate to get back to CNY
  return parseFloat((amount / exchangeRates[fromCurrency]).toFixed(2));
};

// Format price with currency symbol
export const formatPrice = (
  amount: number, 
  currency: UserCurrency = 'EUR'
): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Get currency name
export const getCurrencyName = (currency: UserCurrency): string => {
  const names: Record<UserCurrency, string> = {
    CNY: 'Yuan chinois',
    EUR: 'Euro',
    USD: 'Dollar américain',
    GBP: 'Livre sterling',
    AED: 'Dirham (AED)',
  };
  return names[currency];
};