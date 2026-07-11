'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { AdminTestimonial } from './TestimonialsManager';

export interface TestimonialFormValues {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: TestimonialFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialTestimonial: AdminTestimonial;
}

export default function TestimonialFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialTestimonial,
}: TestimonialFormModalProps) {
  const [form, setForm] = useState<TestimonialFormValues>({
    name: initialTestimonial.name,
    role: initialTestimonial.role,
    company: initialTestimonial.company ?? '',
    quote: initialTestimonial.quote,
    rating: initialTestimonial.rating,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset whenever the modal opens for a (possibly different) testimonial
    setForm({
      name: initialTestimonial.name,
      role: initialTestimonial.role,
      company: initialTestimonial.company ?? '',
      quote: initialTestimonial.quote,
      rating: initialTestimonial.rating,
    });
    setError('');
  }, [isOpen, initialTestimonial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.role.trim() || !form.quote.trim()) {
      setError('Name, role, and quote are required.');
      return;
    }

    onSave(form);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Testimonial" className="max-w-lg">
      <h2 className="font-display text-text-primary text-lg font-semibold">Edit Testimonial</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Role</label>
            <Input
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. Plant Manager"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Company <span className="text-text-secondary">(optional)</span>
          </label>
          <Input
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Quote</label>
          <Textarea
            value={form.quote}
            onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, rating: n }))}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
              >
                <Star
                  className={cn(
                    'h-5 w-5',
                    n <= form.rating ? 'fill-accent-amber text-accent-amber' : 'text-border'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}