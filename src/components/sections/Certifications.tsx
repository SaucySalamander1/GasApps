import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';

// Placeholder data — replace with real certifications once available (Module 13).
const certifications = [
  { code: 'ISO 9001', label: 'Quality Management' },
  { code: 'ISO 14001', label: 'Environmental Management' },
  { code: 'API 6D', label: 'Pipeline Valve Standard' },
  { code: 'ASME B16.34', label: 'Valve Design Standard' },
];

export function Certifications() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Certifications &amp; Compliance
          </h2>
          <p className="text-text-secondary mt-4 text-base md:text-lg">
            Every product and process is held to internationally recognized standards.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {certifications.map(({ code, label }) => (
            <div
              key={code}
              className="border-border bg-background flex flex-col items-center gap-2 rounded-lg border p-6 text-center"
            >
              <Badge variant="success">{code}</Badge>
              <span className="text-text-secondary text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
