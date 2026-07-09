'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

// Placeholder data — replace with real product/content search once Products (Module 8)
// and backend search (Module 20/26) exist.
const mockResults = [
  { label: 'Ball Valves', category: 'Products', href: '/products' },
  { label: 'Pressure Gauges', category: 'Products', href: '/products' },
  { label: 'Calibration Services', category: 'Services', href: '/services' },
  { label: 'ISO Certifications', category: 'Resources', href: '/certifications' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const filtered =
    query.length > 0
      ? mockResults.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
      : mockResults;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="bg-surface border-border shadow-elevated relative z-10 w-full max-w-xl rounded-lg border"
      >
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
          <Search size={18} className="text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, resources..."
            className="text-text-primary placeholder:text-text-secondary flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-text-secondary hover:text-text-primary shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-text-secondary px-3 py-6 text-center text-sm">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:bg-background flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors"
              >
                <span className="text-text-primary">{item.label}</span>
                <span className="text-text-secondary text-xs">{item.category}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
