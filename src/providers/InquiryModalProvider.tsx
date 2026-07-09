'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface InquiryModalContextValue {
  isOpen: boolean;
  prefill: { itemName?: string };
  openInquiryModal: (prefill?: { itemName?: string }) => void;
  closeInquiryModal: () => void;
}

const InquiryModalContext = createContext<InquiryModalContextValue | undefined>(undefined);

export function InquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ itemName?: string }>({});

  function openInquiryModal(newPrefill?: { itemName?: string }) {
    setPrefill(newPrefill ?? {});
    setIsOpen(true);
  }

  function closeInquiryModal() {
    setIsOpen(false);
  }

  return (
    <InquiryModalContext.Provider value={{ isOpen, prefill, openInquiryModal, closeInquiryModal }}>
      {children}
    </InquiryModalContext.Provider>
  );
}

export function useInquiryModal() {
  const context = useContext(InquiryModalContext);
  if (!context) throw new Error('useInquiryModal must be used within an InquiryModalProvider');
  return context;
}
