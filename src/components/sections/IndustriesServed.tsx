import Link from 'next/link';
import { ArrowRight, Factory, Fuel, FlaskConical, Building2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';

// Placeholder data — replace with real industries data once Industries module (Module 11) exists.
const industries = [
  { icon: Fuel, name: 'Oil & Gas' },
  { icon: Factory, name: 'Manufacturing' },
  { icon: FlaskConical, name: 'Chemical Processing' },
  { icon: Building2, name: 'Infrastructure' },
];

export function IndustriesServed() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Industries We Serve
            </h2>
            <p className="text-text-secondary mt-2 max-w-xl">
              Trusted by teams working in demanding, safety-critical sectors.
            </p>
          </div>
          <Link
            href="/industries"
            className="text-accent flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            View all industries
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {industries.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="border-border bg-background flex flex-col items-center gap-3 rounded-lg border p-6 text-center"
            >
              <Icon size={28} className="text-accent" />
              <span className="font-display text-sm font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
