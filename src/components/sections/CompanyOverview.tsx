import { ShieldCheck, Gauge, Wrench } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Certified Quality',
    description: 'ISO-certified manufacturing and testing processes across every product line.',
  },
  {
    icon: Gauge,
    title: 'Precision Instrumentation',
    description:
      'Engineered to exacting tolerances for accuracy in the most demanding environments.',
  },
  {
    icon: Wrench,
    title: 'Full Lifecycle Support',
    description: 'From specification and installation through calibration and maintenance.',
  },
];

export function CompanyOverview() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Engineering Trust Into Every Fitting
          </h2>
          <p className="text-text-secondary mt-4 text-base md:text-lg">
            For over two decades, GasApps has supplied industrial gas fittings and instrumentation
            to sectors where failure isn&apos;t an option. Our engineering-first approach means
            every product is designed, tested, and certified to perform under pressure — literally.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
                <Icon size={24} />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="text-text-secondary text-sm">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
