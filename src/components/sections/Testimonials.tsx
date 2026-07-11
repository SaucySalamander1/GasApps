import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Quote, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { cn } from '@/utils/cn';

// Shows the most recent approved reviews, so the homepage stays current
// without a rebuild whenever an admin approves a new one.
export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              What Our Clients Say
            </h2>
          </div>
          <Link href="/testimonials" className="text-accent text-sm font-medium hover:underline">
            Read more &amp; leave a review &rarr;
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border-border bg-background flex flex-col gap-4 rounded-lg border p-6"
            >
              <Quote size={24} className="text-accent" />
              <p className="text-text-primary text-sm leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={cn(
                      n <= testimonial.rating ? 'fill-accent-amber text-accent-amber' : 'text-border'
                    )}
                  />
                ))}
              </div>
              <div>
                <p className="font-display text-sm font-semibold">{testimonial.name}</p>
                <p className="text-text-secondary text-xs">
                  {testimonial.role}
                  {testimonial.company ? ` · ${testimonial.company}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}