import { Container } from '@/components/layout/Container';

// Placeholder — replace with real partner/client logos once available.
const partners = ['Partner One', 'Partner Two', 'Partner Three', 'Partner Four', 'Partner Five'];

export function Partners() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Partners &amp; Clients
          </h2>
          <p className="text-text-secondary mt-2">
            Trusted by organizations across industrial and infrastructure sectors.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((partner) => (
            <div
              key={partner}
              className="border-border bg-background text-text-secondary flex h-20 items-center justify-center rounded-lg border px-4 text-center text-sm font-medium"
            >
              {partner}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
