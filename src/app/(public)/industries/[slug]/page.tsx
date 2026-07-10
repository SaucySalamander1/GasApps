import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { industries } from '@/data/industries';
import { products } from '@/data/products';

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);

  if (!industry) {
    notFound();
  }

  const otherIndustries = industries.filter((i) => i.slug !== industry.slug).slice(0, 3);
  const relatedProducts = products.filter((p) => p.industries?.includes(industry.slug)).slice(0, 3);

  return (
    <>
      <section className="border-border border-b py-8">
        <Container>
          <Breadcrumb
            items={[{ label: 'Industries', href: '/industries' }, { label: industry.name }]}
          />
        </Container>
      </section>

      <section className="py-[var(--space-section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="relative h-80 w-full overflow-hidden rounded-lg lg:h-full">
            {industry.images?.[0] ? (
              <Image
                src={industry.images[0]}
                alt={industry.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder className="h-full w-full" />
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {industry.name}
            </h1>
            <p className="text-text-secondary mt-4 text-base leading-relaxed">
              {industry.description}
            </p>

            <div className="mt-8">
              <Link
                href="/contact"
                className="bg-accent hover:bg-accent-hover inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-medium text-white transition-colors"
              >
                Discuss Your Requirements
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-lg font-semibold">Common Applications</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {industry.applications.map((application) => (
                  <li
                    key={application}
                    className="text-text-secondary flex items-start gap-2.5 text-sm"
                  >
                    <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                    {application}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Recommended Products
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <Card key={product.slug} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-accent text-sm font-medium hover:underline"
                    >
                      View details →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {otherIndustries.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Other Industries
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {otherIndustries.map((other) => (
                <Card key={other.slug} className="overflow-hidden">
                  <div className="relative h-32 w-full">
                    {other.images?.[0] ? (
                      <Image
                        src={other.images[0]}
                        alt={other.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{other.name}</CardTitle>
                    <CardDescription>{other.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/industries/${other.slug}`}
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