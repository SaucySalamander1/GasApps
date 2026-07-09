import { Container } from '@/components/layout/Container';

// Placeholder — replace with real partner/client logos once available.
// Same source list as the About page's Partners section — keep both in sync when real logos arrive.
const partners = ['Partner One', 'Partner Two', 'Partner Three', 'Partner Four', 'Partner Five'];

export function PartnerLogos() {
  return (
    <section className="border-border border-y py-10">
      <Container>
        <p className="text-text-secondary mb-6 text-center text-xs font-medium tracking-wide uppercase">
          Trusted by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
          {partners.map((partner) => (
            <span key={partner} className="text-text-secondary text-sm font-semibold">
              {partner}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
