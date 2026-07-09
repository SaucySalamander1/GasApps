'use client';

import { useInquiryModal } from '@/providers/InquiryModalProvider';

export function ProductInquiryButton({ productName }: { productName: string }) {
  const { openInquiryModal } = useInquiryModal();

  return (
    <button
      type="button"
      onClick={() => openInquiryModal({ itemName: productName })}
      className="border-border hover:border-accent inline-flex h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors"
    >
      Ask a Question
    </button>
  );
}
