import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { prisma } from '@/lib/prisma';

// Industries are managed live from the admin panel, so this page always
// reads the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function IndustriesPage() {
  const industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } });

  return (
    <>
      <PageHeader
        title="Industries We Serve"
        description="Trusted by teams working in demanding, safety-critical sectors."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <Card key={industry.slug} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  {industry.images?.[0] ? (
                    <Image
                      src={industry.images[0]}
                      alt={industry.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-full w-full" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-base">{industry.name}</CardTitle>
                  <CardDescription>{industry.summary}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/industries/${industry.slug}`}
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

      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-lg text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Don&apos;t See Your Industry?
            </h2>
            <p className="text-text-secondary max-w-xl">
              We work across a wide range of industrial sectors. Talk to our team about your
              specific application.
            </p>
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-hover inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-medium text-white transition-colors"
            >
              Contact Our Team
              <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}