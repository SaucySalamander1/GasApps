'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuoteModal } from '@/providers/QuoteModalProvider';

export function ServiceQuoteButton({ serviceName }: { serviceName: string }) {
  const { openQuoteModal } = useQuoteModal();

  return (
    <Button size="lg" onClick={() => openQuoteModal({ productName: serviceName })}>
      Request Consultation
      <ArrowRight size={18} />
    </Button>
  );
}
