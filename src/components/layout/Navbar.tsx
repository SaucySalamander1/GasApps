'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { MobileNav } from '@/components/layout/MobileNav';
import { SearchModal } from '@/components/layout/SearchModal';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/ui/Dropdown';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

const solutionsLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Careers', href: '/careers' },
];

const resourcesLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Resources', href: '/resources' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'FAQ', href: '/faq' },
];

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <span className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-sm font-medium transition-colors">
          {label}
          <ChevronDown size={14} />
        </span>
      </DropdownTrigger>
      <DropdownContent>
        {links.map((link) => (
          <DropdownItem key={link.href} href={link.href}>
            {link.label}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openQuoteModal } = useQuoteModal();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Products
          </Link>
          <NavDropdown label="Solutions" links={solutionsLinks} />
          <NavDropdown label="Company" links={companyLinks} />
          <NavDropdown label="Resources" links={resourcesLinks} />
          <Link
            href="/contact"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="text-text-secondary hover:text-text-primary hidden h-9 w-9 items-center justify-center rounded-md transition-colors sm:flex"
          >
            <Search size={18} />
          </button>
          <ThemeToggle />
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => openQuoteModal()}>
            Request Quote
          </Button>
          <MobileNav onSearchOpen={() => setIsSearchOpen(true)} />
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
