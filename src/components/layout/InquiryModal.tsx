'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useInquiryModal } from '@/providers/InquiryModalProvider';
import { useToast } from '@/providers/ToastProvider';

const emptyForm = { name: '', email: '', itemName: '', message: '' };

export function InquiryModal() {
  const { isOpen, prefill, closeInquiryModal } = useInquiryModal();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill form when modal opens
      setFormData((prev) => ({ ...prev, itemName: prefill.itemName ?? '' }));
    }
  }, [isOpen, prefill]);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong.');
      }

      showToast("Question sent! We'll get back to you soon.", 'success');
      setFormData(emptyForm);
      closeInquiryModal();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeInquiryModal} title="Ask a Question" className="max-w-lg">
      <h2 className="font-display text-xl font-semibold">Ask a Question</h2>
      <p className="text-text-secondary mt-1 text-sm">
        Have a question before requesting a quote? Send it here and our team will follow up
        directly.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="inquiry-name"
              className="text-text-primary mb-1.5 block text-sm font-medium"
            >
              Full Name
            </label>
            <Input
              id="inquiry-name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="inquiry-email"
              className="text-text-primary mb-1.5 block text-sm font-medium"
            >
              Email Address
            </label>
            <Input
              id="inquiry-email"
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
            htmlFor="inquiry-item"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Regarding
          </label>
          <Input
            id="inquiry-item"
            value={formData.itemName}
            onChange={(e) => handleChange('itemName', e.target.value)}
            placeholder="e.g. Precision Ball Valves"
          />
        </div>

        <div>
          <label
            htmlFor="inquiry-message"
            className="text-text-primary mb-1.5 block text-sm font-medium"
          >
            Your Question
          </label>
          <Textarea
            id="inquiry-message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="What would you like to know?"
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Sending...' : 'Send Question'}
          <Send size={18} />
        </Button>
      </form>
    </Modal>
  );
}