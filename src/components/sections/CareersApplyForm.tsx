'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';

export function CareersApplyForm() {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong.');
      }

      showToast('Application received! We\u2019ll be in touch if there\u2019s a match.', 'success');
      setFormData({ name: '', email: '', position: '', message: '' });
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
          <label htmlFor="email" className="text-text-primary mb-1.5 block text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="position" className="text-text-primary mb-1.5 block text-sm font-medium">
          Position of Interest
        </label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          placeholder="e.g. Mechanical Engineer, General Interest"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-text-primary mb-1.5 block text-sm font-medium">
          Tell Us About Yourself
        </label>
        <Textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Briefly describe your background and what you're looking for..."
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
        <Send size={18} />
      </Button>
    </form>
  );
}