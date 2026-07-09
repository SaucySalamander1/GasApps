import { Container } from '@/components/layout/Container';

// Placeholder data — replace with real leadership team info (names, titles, photos) when available.
const leaders = [
  { role: 'Chief Executive Officer', initials: 'CEO' },
  { role: 'Head of Engineering', initials: 'HOE' },
  { role: 'Operations Director', initials: 'OD' },
];

export function Leadership() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Leadership
          </h2>
          <p className="text-text-secondary mt-2">
            Meet the team guiding GasApps&apos; engineering and operations.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {leaders.map((leader) => (
            <div key={leader.role} className="flex flex-col items-center gap-3 text-center">
              <div className="bg-accent/10 text-accent flex h-24 w-24 items-center justify-center rounded-full text-lg font-semibold">
                {leader.initials}
              </div>
              <div>
                <p className="font-display font-semibold">{leader.role}</p>
                <p className="text-text-secondary text-sm">Name to be added</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
