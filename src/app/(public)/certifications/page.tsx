import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { certifications } from '@/data/certifications';

const categories = ['ISO', 'Compliance', 'Accreditation'] as const;

export default function CertificationsPage() {
  return (
    <>
      <PageHeader
        title="Certifications & Compliance"
        description="Every product and process is held to internationally recognized standards."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          {categories.map((category) => {
            const items = certifications.filter((c) => c.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {category}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {items.map((cert) => (
                    <div key={cert.code} className="border-border rounded-lg border p-6">
                      <Badge variant="success" className="mb-3">
                        {cert.code}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold">{cert.name}</h3>
                      <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}
