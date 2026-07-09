'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

export function ProductQuoteButton({ productName }: { productName: string }) {
  const { openQuoteModal } = useQuoteModal();

  return (
    <Button size="lg" onClick={() => openQuoteModal({ productName })}>
      Request a Quote
      <ArrowRight size={18} />
    </Button>
  );
}
