'use client';

import { useState } from 'react';
import { Send, Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';
import { cn } from '@/utils/cn';

export function TestimonialSubmitForm() {
  const [formData, setFormData] = useState({ name: '', role: '', company: '', quote: '' });
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.quote) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, rating }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong.');
      }

      showToast('Thanks for your review! It will appear once approved.', 'success');
      setFormData({ name: '', role: '', company: '', quote: '' });
      setRating(5);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-text-primary mb-1.5 block text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-text-primary mb-1.5 block text-sm font-medium">
            Role
          </label>
          <Input
            id="role"
            required
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g. Plant Manager"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="text-text-primary mb-1.5 block text-sm font-medium">
          Company <span className="text-text-secondary">(optional)</span>
        </label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="e.g. Chemical Processing Ltd."
        />
      </div>

      <div>
        <span className="text-text-primary mb-1.5 block text-sm font-medium">Your Rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
            >
              <Star
                size={24}
                className={cn(
                  n <= rating ? 'fill-accent-amber text-accent-amber' : 'text-border'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="quote" className="text-text-primary mb-1.5 block text-sm font-medium">
          Your Review
        </label>
        <Textarea
          id="quote"
          required
          rows={5}
          value={formData.quote}
          onChange={(e) => handleChange('quote', e.target.value)}
          placeholder="Tell us about your experience working with us..."
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
        <Send size={18} />
      </Button>
    </form>
  );
}