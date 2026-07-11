import { Quote, Star } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { TestimonialSubmitForm } from '@/components/sections/TestimonialSubmitForm';
import { prisma } from '@/lib/prisma';
import { cn } from '@/utils/cn';

// Approved testimonials can change at any time from the admin panel, so this
// page always reads the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHeader
        title="Client Testimonials"
        description="Hear from the teams we've worked with, and share your own experience below."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          {testimonials.length === 0 ? (
            <p className="text-text-secondary text-sm">
              No reviews published yet &mdash; be the first to share your experience below.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border-border bg-surface flex flex-col gap-4 rounded-lg border p-6"
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
                          n <= testimonial.rating
                            ? 'fill-accent-amber text-accent-amber'
                            : 'text-border'
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
          )}
        </Container>
      </section>

      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Leave a Review
          </h2>
          <p className="text-text-secondary mt-2 text-sm">
            Reviews are checked before publishing, so yours may take a little time to appear.
          </p>
          <div className="mt-8">
            <TestimonialSubmitForm />
          </div>
        </Container>
      </section>
    </>
  );
}