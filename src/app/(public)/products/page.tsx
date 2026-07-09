import { prisma } from '@/lib/prisma';
import { ProductsPageClient } from './ProductsPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const dbProducts = await prisma.product.findMany({
    include: { specifications: true, downloads: true },
    orderBy: { name: 'asc' },
  });

  const products = dbProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    images: p.images,
    industries: p.industries,
    leadTime: p.leadTime ?? undefined,
    warranty: p.warranty ?? undefined,
    certificationCodes: p.certificationCodes,
    features: p.features,
    specifications: p.specifications.map((s) => ({ label: s.label, value: s.value })),
    downloads: p.downloads.map((d) => ({
      label: d.label,
      fileType: d.fileType,
      fileSize: d.fileSize,
    })),
  }));

  return <ProductsPageClient products={products} />;
}
