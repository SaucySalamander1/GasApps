import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { ServicesConsultationCta } from '@/components/sections/ServicesConsultationCta';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const genericProcess = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We discuss your requirements and current setup.',
  },
  {
    step: '02',
    title: 'Assessment',
    description: 'Our engineers assess the technical scope of work.',
  },
  {
    step: '03',
    title: 'Execution',
    description: 'Our team carries out the service to specification.',
  },
  {
    step: '04',
    title: 'Follow-Up',
    description: 'We confirm results and remain available for support.',
  },
];

// Services are managed live from the admin panel, so this page always reads
// the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });

  return (
    <>
      <PageHeader
        title="Engineering Services"
        description="Full lifecycle support — from installation through ongoing maintenance and consultation."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.slug} className="overflow-hidden">
                {service.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder className="h-40 w-full" />
                )}
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.summary}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-accent text-sm font-medium hover:underline"
                  >
                    Learn more →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Engineering Process */}
      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Our Engineering Process
            </h2>
            <p className="text-text-secondary mt-2">
              A consistent, transparent process across every service we provide.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {genericProcess.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col gap-2">
                <span className="text-accent font-display text-2xl font-semibold">{step}</span>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="text-text-secondary text-sm">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ServicesConsultationCta />
    </>
  );
}