import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ServiceQuoteButton } from '@/components/sections/ServiceQuoteButton';
import { services } from '@/data/services';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((s) => s.slug !== service.slug).slice(0, 2);

  return (
    <>
      <section className="border-border border-b py-8">
        <Container>
          <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: service.name }]} />
        </Container>
      </section>

      <section className="py-[var(--space-section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            {service.images?.[0] ? (
              <img
                src={service.images[0]}
                alt={service.name}
                className="h-80 w-full rounded-lg object-cover lg:h-full"
              />
            ) : (
              <ImagePlaceholder className="h-80 w-full rounded-lg lg:h-full" />
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {service.name}
            </h1>
            <p className="text-text-secondary mt-4 text-base leading-relaxed">
              {service.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ServiceQuoteButton serviceName={service.name} />
              <Link
                href="/contact"
                className="border-border hover:border-accent inline-flex h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors"
              >
                Ask a Question
              </Link>
            </div>

            {/* Duration, Coverage, Certifications */}
            {(service.duration || service.coverageArea || service.certificationCodes) && (
              <div className="border-border bg-surface mt-8 grid grid-cols-1 gap-4 rounded-lg border p-5 sm:grid-cols-3">
                {service.duration && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Typical Duration
                    </p>
                    <p className="text-text-primary mt-1 text-sm font-medium">{service.duration}</p>
                  </div>
                )}
                {service.coverageArea && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Coverage Area
                    </p>
                    <p className="text-text-primary mt-1 text-sm font-medium">
                      {service.coverageArea}
                    </p>
                  </div>
                )}
                {service.certificationCodes && service.certificationCodes.length > 0 && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Certified
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {service.certificationCodes.map((code) => (
                        <Badge key={code} variant="success">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-display text-lg font-semibold">What&apos;s Included</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-text-secondary flex items-start gap-2.5 text-sm"
                  >
                    <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Service-specific Process */}
      {service.process && service.process.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              How It Works
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, index) => (
                <div key={step.title} className="flex flex-col gap-2">
                  <span className="text-accent font-display text-2xl font-semibold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                  <p className="text-text-secondary text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Other Services */}
      {relatedServices.length > 0 && (
        <section className="py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Other Services
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedServices.map((related) => (
                <Card key={related.slug}>
                  <CardHeader>
                    <CardTitle>{related.name}</CardTitle>
                    <CardDescription>{related.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/services/${related.slug}`}
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
      )}
    </>
  );
}
