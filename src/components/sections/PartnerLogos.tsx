import { Factory, Fuel, FlaskConical, Building2, Ship, Wrench, Gauge, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';

/**
 * Placeholder partners — replace `logoUrl` with a real logo image once
 * available and the icon fallback is dropped automatically. Same source
 * list as the About page's Partners section — keep both in sync.
 */
interface Partner {
  name: string;
  icon: typeof Factory;
  logoUrl?: string;
}

const partners: Partner[] = [
  { name: 'Petrotech Industries', icon: Fuel },
  { name: 'Meridian Energy Group', icon: Factory },
  { name: 'Falcon Manufacturing', icon: Wrench },
  { name: 'Horizon Chemical Co.', icon: FlaskConical },
  { name: 'Continental Infrastructure', icon: Building2 },
  { name: 'Blue Harbor Marine', icon: Ship },
  { name: 'Apex Instrumentation', icon: Gauge },
  { name: 'Sentinel Compliance', icon: ShieldCheck },
];

export function PartnerLogos() {
  return (
    <section className="border-border border-y py-14">
      <Container>
        <p className="text-text-secondary mb-10 text-center text-xs font-medium tracking-wide uppercase">
          Trusted by teams across industry
        </p>

        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-12 sm:gap-x-14">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="animate-float-badge flex w-24 flex-col items-center gap-3 text-center"
              style={{ animationDelay: `${(index % 4) * 0.6}s` }}
            >
              <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Slowly rotating dashed ring around the badge */}
                <div className="border-accent/30 animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed" />

                {/* Static inner badge so the logo/icon itself stays readable */}
                <div className="bg-surface border-border text-text-secondary hover:text-accent hover:border-accent/40 flex h-14 w-14 items-center justify-center rounded-full border shadow-sm transition-colors">
                  {partner.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- decorative partner logo, doesn't need Next/Image optimization
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <partner.icon size={22} strokeWidth={1.75} />
                  )}
                </div>
              </div>

              <span className="text-text-secondary text-xs leading-tight font-medium">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}