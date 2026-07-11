import { prisma } from '@/lib/prisma';
import { ResourcesPageClient } from './ResourcePageClient';

// Resources are managed live from the admin panel, so this page always reads
// the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const dbResources = await prisma.resource.findMany({ orderBy: { name: 'asc' } });

  const resources = dbResources.map((r) => ({
    slug: r.slug,
    name: r.name,
    category: r.category,
    fileType: r.fileType,
    fileSize: r.fileSize,
    fileUrl: r.fileUrl ?? undefined,
  }));

  return <ResourcesPageClient resources={resources} />;
}