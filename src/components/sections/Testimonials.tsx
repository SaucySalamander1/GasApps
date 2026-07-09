import { Container } from '@/components/layout/Container';
import { Quote } from 'lucide-react';

// Placeholder data — replace with real customer testimonials once available.
const testimonials = [
  {
    quote:
      'GasApps delivered exactly to spec and on schedule. Their instrumentation has run reliably for years with minimal maintenance.',
    name: 'Rafiqul Islam',
    role: 'Plant Manager, Chemical Processing',
  },
  {
    quote:
      'Their engineering team caught a design issue before installation that would have cost us significant downtime.',
    name: 'Farhana Chowdhury',
    role: 'Project Engineer, Oil & Gas',
  },
  {
    quote:
      'Responsive support and consistently high-quality fittings. GasApps is our default supplier for new projects.',
    name: 'Tanvir Ahmed',
    role: 'Procurement Lead, Infrastructure',
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            What Our Clients Say
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="border-border bg-background flex flex-col gap-4 rounded-lg border p-6"
            >
              <Quote size={24} className="text-accent" />
              <p className="text-text-primary text-sm leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-display text-sm font-semibold">{testimonial.name}</p>
                <p className="text-text-secondary text-xs">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
