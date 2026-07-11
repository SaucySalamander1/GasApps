import Link from 'next/link';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { prisma } from '@/lib/prisma';

// Projects are managed live from the admin panel, so this page always reads
// the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const [projects, industries] = await Promise.all([
    prisma.project.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.industry.findMany(),
  ]);

  function getIndustryName(slug: string) {
    return industries.find((i) => i.slug === slug)?.name ?? slug;
  }

  return (
    <>
      <PageHeader
        title="Projects & Case Studies"
        description="Real-world engineering work across critical infrastructure."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.slug} className="overflow-hidden">
                {project.images?.[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder className="h-48 w-full" />
                )}
                <CardHeader>
                  <Badge variant="accent" className="mb-2 w-fit">
                    {getIndustryName(project.industry)}
                  </Badge>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.summary}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/projects/${project.slug}`}
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
    </>
  );
}