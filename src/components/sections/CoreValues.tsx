import { ShieldCheck, Gauge, Users, TrendingUp } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const values = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description:
      'Every product and process is designed with safety as the non-negotiable baseline.',
  },
  {
    icon: Gauge,
    title: 'Precision',
    description: 'We engineer to exact tolerances — close enough is not good enough.',
  },
  {
    icon: Users,
    title: 'Partnership',
    description: 'We work alongside our clients as engineering partners, not just a vendor.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    description: 'We refine our processes and products based on real field performance data.',
  },
];

export function CoreValues() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Our Core Values
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
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
