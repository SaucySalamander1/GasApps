'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useQuoteModal } from '@/providers/QuoteModalProvider';
import { useToast } from '@/providers/ToastProvider';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  productOrService: '',
  quantity: '',
  message: '',
};

export function QuoteRequestModal() {
  const { isOpen, prefill, closeQuoteModal } = useQuoteModal();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, productOrService: prefill.productName ?? '' }));
    }
  }, [isOpen, prefill]);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.productOrService) return;

    setIsSubmitting(true);

    // Placeholder \u2014 replace with real API call once Email Service (Module 41) exists.
    setTimeout(() => {
      showToast('Quote request sent! Our team will follow up shortly.', 'success');
      setFormData(emptyForm);
      setIsSubmitting(false);
      closeQuoteModal();
    }, 800);
  }

  return (
    <Modal isOpen={isOpen} onClose={closeQuoteModal} title="Request a Quote" className="max-w-lg">
      <h2 className="font-display text-xl font-semibold">Request a Quote</h2>
      <p className="text-text-secondary mt-1 text-sm">
        Tell us what you need and our team will get back to you with pricing and lead time.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quote-name"
              className="text-text-primary mb-1.5 block text-sm font-medium"
            >
              Full Name
            </label>
            <Input
              id="quote-name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="quote-email"
              className="text-text-primary mb-1.5 block text-sm font-medium"
            >
              Email Address
            </label>
            <Input
              id="quote-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="quote-company"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Company Name
          </label>
          <Input
            id="quote-company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Your company"
          />
        </div>

        <div>
          <label
            htmlFor="quote-product"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Product or Service
          </label>
          <Input
            id="quote-product"
            required
            value={formData.productOrService}
            onChange={(e) => handleChange('productOrService', e.target.value)}
            placeholder="e.g. Precision Ball Valves"
          />
        </div>

        <div>
          <label
            htmlFor="quote-quantity"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Quantity (if applicable)
          </label>
          <Input
            id="quote-quantity"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="e.g. 50 units"
          />
        </div>

        <div>
          <label
            htmlFor="quote-message"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Additional Details
          </label>
          <Textarea
            id="quote-message"
            rows={3}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Specifications, timeline, or anything else we should know..."
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Sending...' : 'Submit Request'}
          <Send size={18} />
        </Button>
      </form>
    </Modal>
  );
}
