import { Container } from '@/components/layout/Container';

export function CompanyStory() {
  return (
    <section className="py-[var(--space-section-y)]">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Our Story
          </h2>
        </div>
        <div className="text-text-secondary flex flex-col gap-4 text-base leading-relaxed">
          <p>
            GasApps began with a simple observation: industrial gas fittings were often treated as
            commodity parts, when in reality they sit at the center of systems where precision and
            safety cannot be compromised.
          </p>
          <p>
            What started as a small engineering-led supplier has grown into a trusted partner for
            organizations across oil &amp; gas, chemical processing, manufacturing, and
            infrastructure — supplying not just products, but the engineering support to back them.
          </p>
          <p>
            Today, our focus remains the same as it was on day one: build things correctly, test
            them rigorously, and stand behind them fully.
          </p>
        </div>
      </Container>
    </section>
  );
}
