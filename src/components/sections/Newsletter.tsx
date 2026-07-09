'use client';

import { useState } from 'react';
import { Mail, Sparkles, ShieldCheck, Bell } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      showToast('Thanks for subscribing!', 'success');
      setEmail('');
      setIsSubmitting(false);
    }, 800);
  }

  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="border-accent/20 from-accent/15 via-surface to-accent/5 relative overflow-hidden rounded-3xl border bg-gradient-to-br px-8 py-14 md:px-16">
          {/* Background Glow */}
          <div className="bg-accent/20 pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full blur-3xl" />
          <div className="bg-accent/10 pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl" />

          {/* Decorative Circles */}
          <div className="bg-accent/50 absolute top-10 left-10 h-2 w-2 rounded-full" />
          <div className="bg-accent/30 absolute top-20 right-24 h-3 w-3 rounded-full" />
          <div className="bg-accent/40 absolute right-16 bottom-12 h-2 w-2 rounded-full" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Badge */}
            <div className="border-accent/30 bg-accent/10 text-accent mb-6 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold">
              <Sparkles size={14} />
              Join Our Community
            </div>

            {/* Icon */}
            <div className="border-accent/20 bg-accent/10 shadow-accent/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-lg">
              <Mail size={34} className="text-accent" />
            </div>

            <h2 className="font-display text-text-primary text-3xl font-bold tracking-tight md:text-4xl">
              Never Miss an Update
            </h2>

            <p className="text-text-secondary mt-4 max-w-2xl text-lg leading-relaxed">
              Stay ahead with product launches, engineering insights, industry trends, maintenance
              tips, and exclusive company updates delivered straight to your inbox.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="border-border/60 bg-background/60 mt-10 flex w-full max-w-2xl flex-col gap-4 rounded-2xl border p-3 backdrop-blur-md sm:flex-row"
            >
              <Input
                type="email"
                required
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-0 bg-transparent"
              />

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>

            {/* Trust Indicators */}
            <div className="text-text-secondary mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-accent" />
                No Spam
              </div>

              <div className="flex items-center gap-2">
                <Bell size={16} className="text-accent" />
                Monthly Updates
              </div>

              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                Unsubscribe Anytime
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
