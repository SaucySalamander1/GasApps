'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface QuoteModalContextValue {
  isOpen: boolean;
  prefill: { productName?: string };
  openQuoteModal: (prefill?: { productName?: string }) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue | undefined>(undefined);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ productName?: string }>({});

  function openQuoteModal(newPrefill?: { productName?: string }) {
    setPrefill(newPrefill ?? {});
    setIsOpen(true);
  }

  function closeQuoteModal() {
    setIsOpen(false);
  }

  return (
    <QuoteModalContext.Provider value={{ isOpen, prefill, openQuoteModal, closeQuoteModal }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  return context;
}
