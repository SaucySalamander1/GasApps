import Link from 'next/link';
import { ArrowRight, Settings2, ClipboardCheck, LifeBuoy } from 'lucide-react';
import { Container } from '@/components/layout/Container';

// Placeholder data — replace with real service data once Services module (Module 10) exists.
const services = [
  {
    icon: Settings2,
    name: 'Installation Support',
    description: 'On-site guidance and technical support for correct, code-compliant installation.',
  },
  {
    icon: ClipboardCheck,
    name: 'Calibration Services',
    description: 'Precision calibration to keep instrumentation accurate and compliant over time.',
  },
  {
    icon: LifeBuoy,
    name: 'Maintenance & Consultation',
    description: 'Ongoing maintenance plans and expert engineering consultation as needs evolve.',
  },
];

export function EngineeringServices() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Engineering Services
            </h2>
            <p className="text-text-secondary mt-2 max-w-xl">
              Beyond products — full engineering support across the equipment lifecycle.
            </p>
          </div>
          <Link
            href="/services"
            className="text-accent flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            View all services
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, name, description }) => (
            <div key={name} className="border-border rounded-lg border p-6">
              <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
                <Icon size={24} />
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold">{name}</h3>
              <p className="text-text-secondary mt-2 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
