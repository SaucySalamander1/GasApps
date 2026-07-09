'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';
import { faqItems, faqCategories } from '@/data/faq';
import { cn } from '@/utils/cn';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof faqCategories)[number]>('All');

  const filtered =
    activeCategory === 'All'
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        description="Answers to common questions about our products, ordering, and support."
      />

      <section className="py-[var(--space-section-y)]">
        <Container className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === category
                    ? 'border-accent bg-accent text-white'
                    : 'border-border text-text-secondary hover:border-accent'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <Accordion type="single" className="mt-8">
            {filtered.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>
    </>
  );
}
