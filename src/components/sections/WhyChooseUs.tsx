import { Container } from '@/components/layout/Container';

// Placeholder figures — replace with real company statistics once available.
const stats = [
  { value: '20+', label: 'Years of Experience' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '98%', label: 'On-Time Delivery' },
  { value: '24/7', label: 'Technical Support' },
];

export function WhyChooseUs() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Why Choose GasApps
          </h2>
          <p className="text-text-secondary mt-4 text-base md:text-lg">
            Numbers that reflect our commitment to reliability, precision, and long-term
            partnership.
          </p>
        </div>

        <div className="border-border mt-12 grid grid-cols-2 gap-8 border-t pt-10 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-display text-accent text-3xl font-semibold md:text-4xl">
                {value}
              </span>
              <span className="text-text-secondary text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
