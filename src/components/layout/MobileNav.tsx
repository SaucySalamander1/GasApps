'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

const directLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

const linkGroups = [
  {
    label: 'Solutions',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Industries', href: '/industries' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Resources', href: '/resources' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

interface MobileNavProps {
  onSearchOpen: () => void;
}

export function MobileNav({ onSearchOpen }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount flag for SSR-safe hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="text-text-primary flex h-9 w-9 items-center justify-center md:hidden"
      >
        <Menu size={22} />
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="bg-background border-border fixed top-0 right-0 flex h-full w-full max-w-xs flex-col border-l">
              {/* Fixed header */}
              <div className="flex shrink-0 items-center justify-between p-6 pb-0">
                <span className="font-display text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable middle */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="flex flex-col gap-1">
                  {directLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-text-primary hover:bg-surface rounded-md px-3 py-2.5 text-base font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <Accordion type="single" className="mt-2">
                  {linkGroups.map((group) => (
                    <AccordionItem key={group.label} value={group.label}>
                      <AccordionTrigger className="px-3 text-base font-medium">
                        {group.label}
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <div className="flex flex-col gap-1">
                          {group.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="text-text-secondary hover:text-text-primary rounded-md py-2 text-sm transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Fixed footer */}
              <div className="border-border flex shrink-0 flex-col gap-3 border-t p-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSearchOpen();
                  }}
                  className="text-text-secondary hover:text-text-primary flex items-center gap-2.5 px-3 py-2.5 text-base"
                >
                  <Search size={18} />
                  Search
                </button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    openQuoteModal();
                  }}
                >
                  Request Quote
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
