'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578356058390-f58c575337a2?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1920&auto=format&fit=crop&q=80',
];

const ROTATION_INTERVAL_MS = 5000;

export function Hero() {
  const { openQuoteModal } = useQuoteModal();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Rotating background images, crossfaded */}
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          aria-hidden={index !== activeIndex}
          className={cn(
            'object-cover transition-opacity duration-1000 ease-in-out',
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}

      {/* Dark gradient overlay for text legibility, in both themes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <Container className="relative">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <Badge variant="accent">Precision Engineered Since Day One</Badge>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            Industrial Gas Fittings &amp; Instrumentation You Can Trust
          </h1>

          <p className="max-w-xl text-base text-white/85 md:text-lg">
            GasApps delivers premium gas fittings, precision instrumentation, and engineering
            services built to the highest safety and performance standards — trusted across
            industries where reliability isn&apos;t optional.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openQuoteModal()}>
              Request a Quote
              <ArrowRight size={18} />
            </Button>
            <Link
              href="/products"
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/40 px-6 text-base font-medium text-white transition-colors hover:border-white'
              )}
            >
              Explore Products
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="mt-2 flex gap-2">
            {HERO_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === activeIndex ? 'bg-accent w-8' : 'w-4 bg-white/40'
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}