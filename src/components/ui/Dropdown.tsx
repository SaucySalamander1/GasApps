'use client';

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within <Dropdown>');
  return context;
}

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useDropdownContext();
  return (
    <div onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DropdownContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen } = useDropdownContext();
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className={cn(
        'border-border bg-surface shadow-elevated absolute top-full left-0 z-50 mt-2 min-w-48 rounded-md border p-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  href,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const { setIsOpen } = useDropdownContext();
  const sharedClassName = cn(
    'hover:bg-background text-text-primary flex w-full items-center rounded-sm px-3 py-2 text-left text-sm transition-colors',
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        role="menuitem"
        onClick={() => setIsOpen(false)}
        className={sharedClassName}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick?.();
        setIsOpen(false);
      }}
      className={sharedClassName}
    >
      {children}
    </button>
  );
}
