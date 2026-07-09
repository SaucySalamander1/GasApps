import { Container } from '@/components/layout/Container';

// Placeholder data — replace with real company milestones/history once available.
const milestones = [
  {
    year: '2006',
    title: 'Founded',
    description: 'GasApps began supplying fittings to regional industrial clients.',
  },
  {
    year: '2012',
    title: 'ISO Certification',
    description: 'Achieved ISO 9001 certification for quality management.',
  },
  {
    year: '2018',
    title: 'Regional Expansion',
    description: 'Expanded operations to serve clients across South Asia.',
  },
  {
    year: '2024',
    title: 'Engineering Services Launch',
    description: 'Introduced dedicated calibration and maintenance services.',
  },
];

export function Timeline() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Our Journey
          </h2>
        </div>

        <div className="border-border relative mt-12 flex flex-col gap-10 border-l pl-8 md:pl-10">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="relative">
              <div className="bg-accent absolute top-1 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full md:-left-[calc(2.5rem+5px)]" />
              <span className="text-accent font-display text-sm font-semibold">
                {milestone.year}
              </span>
              <h3 className="font-display mt-1 text-lg font-semibold">{milestone.title}</h3>
              <p className="text-text-secondary mt-1 text-sm">{milestone.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
