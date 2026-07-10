'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within <Accordion>');
  return context;
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
}

export function Accordion({
  children,
  className,
  type = 'single',
  defaultOpen = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(type === 'single' ? [] : prev);
      if (prev.has(value)) {
        if (type === 'single') return new Set();
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-border divide-y', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext<string>('');

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={className}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const value = useContext(AccordionItemContext);
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.has(value);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-sm font-medium',
        className
      )}
    >
      {children}
      <ChevronDown
        size={16}
        className={cn('text-text-secondary shrink-0 transition-transform', isOpen && 'rotate-180')}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const value = useContext(AccordionItemContext);
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);

  if (!isOpen) return null;

  return <div className={cn('text-text-secondary pb-4 text-sm', className)}>{children}</div>;
}
