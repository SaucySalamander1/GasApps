'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchResult {
  label: string;
  category: string;
  href: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount flag for SSR-safe hydration
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
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale query when modal closes
      setQuery('');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale results when modal closes
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear results when query too short to search
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  if (!mounted || !isOpen) return null;

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
            placeholder="Search products, services, industries..."
            className="text-text-primary placeholder:text-text-secondary flex-1 bg-transparent text-sm outline-none"
          />
          {isSearching && (
            <Loader2 size={16} className="text-text-secondary shrink-0 animate-spin" />
          )}
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
          {query.trim().length < 2 ? (
            <p className="text-text-secondary px-3 py-6 text-center text-sm">
              Type at least 2 characters to search
            </p>
          ) : results.length === 0 && !isSearching ? (
            <p className="text-text-secondary px-3 py-6 text-center text-sm">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((item) => (
              
              <a  key={`${item.category}-${item.label}`}
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