import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { projects } from '@/data/projects';
import { industries } from '@/data/industries';
import { products } from '@/data/products';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const industry = industries.find((i) => i.slug === project.industry);
  const relatedProducts = products.filter((p) => project.productSlugs?.includes(p.slug));
  const otherProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <section className="border-border border-b py-8">
        <Container>
          <Breadcrumb items={[{ label: 'Projects', href: '/projects' }, { label: project.name }]} />
        </Container>
      </section>

      <section className="py-[var(--space-section-y)]">
        <Container>
          {project.images?.[0] ? (
            <img
              src={project.images[0]}
              alt={project.name}
              className="h-72 w-full rounded-lg object-cover md:h-96"
            />
          ) : (
            <ImagePlaceholder className="h-72 w-full rounded-lg md:h-96" />
          )}

          <div className="mt-8 max-w-2xl">
            {industry && (
              <Badge variant="accent" className="mb-3">
                {industry.name}
              </Badge>
            )}
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {project.name}
            </h1>
            <p className="text-text-secondary mt-4 text-base leading-relaxed">{project.summary}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-semibold">The Challenge</h2>
              <p className="text-text-secondary mt-3 text-sm leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Our Solution</h2>
              <p className="text-text-secondary mt-3 text-sm leading-relaxed">{project.solution}</p>
            </div>
          </div>

          <div className="border-border mt-12 grid grid-cols-1 gap-6 border-t pt-10 sm:grid-cols-3">
            {project.results.map((result) => (
              <div key={result.metric} className="flex flex-col gap-1">
                <span className="font-display text-accent text-3xl font-semibold">
                  {result.value}
                </span>
                <span className="text-text-secondary text-sm">{result.metric}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Products Used
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <Card key={product.slug} className="overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-40 w-full" />
                  )}
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

      {otherProjects.length > 0 && (
        <section className="py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Other Projects
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherProjects.map((other) => (
                <Card key={other.slug} className="overflow-hidden">
                  {other.images?.[0] ? (
                    <img
                      src={other.images[0]}
                      alt={other.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-40 w-full" />
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">{other.name}</CardTitle>
                    <CardDescription>{other.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/projects/${other.slug}`}
                      className="text-accent text-sm font-medium hover:underline"
                    >
                      View case study →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Have a Similar Project in Mind?
            </h2>
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-hover inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-medium text-white transition-colors"
            >
              Talk to Our Team
              <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
