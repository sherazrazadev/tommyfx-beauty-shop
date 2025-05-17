import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported currencies and their symbols
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'PKR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Exchange rate relative to USD (1 USD = rate in this currency)
}

// Define currency data with exchange rates (approximate rates, would need to be updated)
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.37 },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.53 },
  PKR: { code: 'PKR', symbol: 'Rs', rate: 278.5 },
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  // Try to get saved currency from localStorage, default to USD
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as CurrencyCode) || 'USD';
  });

  // Get the full currency info based on the code
  const currency = CURRENCIES[currencyCode];

  // Save to localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('currency', currencyCode);
  }, [currencyCode]);

  // Function to change the currency
  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
  };

  // Function to convert prices from USD to the selected currency
  const convertPrice = (priceInUSD: number): number => {
    return parseFloat((priceInUSD * currency.rate).toFixed(2));
  };

  // Format a price with the proper currency symbol
  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Format based on currency
    if (currency.code === 'PKR') {
      // PKR typically shows the symbol after the amount with a space
      return `${convertedPrice.toLocaleString()} ${currency.symbol}`;
    } else {
      // Most other currencies show the symbol before the amount
      return `${currency.symbol}${convertedPrice.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}