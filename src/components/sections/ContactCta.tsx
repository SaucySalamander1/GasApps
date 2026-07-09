'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

export function ContactCta() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="border-accent/20 from-accent/10 via-surface to-accent/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-10 text-center md:p-16">
          {/* Soft glow accents */}
          <div
            className="bg-accent/20 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="bg-accent/10 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-6">
            <div className="border-accent/30 bg-accent/10 text-accent flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
              <Sparkles size={14} />
              Let&apos;s Build Something Reliable
            </div>

            <h2 className="font-display text-text-primary text-2xl font-semibold tracking-tight md:text-3xl">
              Ready to Discuss Your Project?
            </h2>
            <p className="text-text-secondary max-w-xl">
              Talk to our engineering team about specifications, lead times, or a custom quote for
              your application.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => openQuoteModal()}>
                Request a Quote
                <ArrowRight size={18} />
              </Button>
              <Link
                href="/contact"
                className={cn(
                  'border-border hover:border-accent inline-flex h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors'
                )}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
