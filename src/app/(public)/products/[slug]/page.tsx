import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Download, FileText } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ProductQuoteButton } from '@/components/sections/ProductQuoteButton';
import { ProductInquiryButton } from '@/components/sections/ProductInquiryButton';
import { prisma } from '@/lib/prisma';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Products are managed live from the admin panel, so this page always reads
// the current DB state rather than pre-rendering a fixed set of slugs.
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { specifications: true, downloads: true },
  });

  if (!dbProduct) {
    notFound();
  }

  const product = {
    slug: dbProduct.slug,
    name: dbProduct.name,
    category: dbProduct.category,
    description: dbProduct.description,
    images: dbProduct.images,
    leadTime: dbProduct.leadTime ?? undefined,
    warranty: dbProduct.warranty ?? undefined,
    certificationCodes: dbProduct.certificationCodes,
    features: dbProduct.features,
    specifications: dbProduct.specifications.map((s) => ({ label: s.label, value: s.value })),
    downloads: dbProduct.downloads.map((d) => ({
      label: d.label,
      fileType: d.fileType,
      fileSize: d.fileSize,
      fileUrl: d.fileUrl ?? undefined,
    })),
  };

  const dbRelated = await prisma.product.findMany({
    where: { category: product.category, slug: { not: product.slug } },
    take: 3,
  });
  const relatedProducts = dbRelated.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    images: p.images,
  }));

  return (
    <>
      <section className="border-border border-b py-8">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Products', href: '/products' },
              { label: product.category, href: `/products?category=${product.category}` },
              { label: product.name },
            ]}
          />
        </Container>
      </section>

      <section className="py-[var(--space-section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div className="relative h-80 w-full overflow-hidden rounded-lg lg:h-full">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder className="h-full w-full" />
            )}
          </div>

          {/* Info */}
          <div>
            <Badge variant="default" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="text-text-secondary mt-4 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ProductQuoteButton productName={product.name} />
              <ProductInquiryButton productName={product.name} />
            </div>

            {/* Lead Time, Warranty, Certifications */}
            {(product.leadTime || product.warranty || product.certificationCodes) && (
              <div className="border-border bg-surface mt-8 grid grid-cols-1 gap-4 rounded-lg border p-5 sm:grid-cols-3">
                {product.leadTime && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Lead Time
                    </p>
                    <p className="text-text-primary mt-1 text-sm font-medium">{product.leadTime}</p>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Warranty
                    </p>
                    <p className="text-text-primary mt-1 text-sm font-medium">{product.warranty}</p>
                  </div>
                )}
                {product.certificationCodes && product.certificationCodes.length > 0 && (
                  <div>
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                      Certified
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {product.certificationCodes.map((code) => (
                        <Badge key={code} variant="success">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-lg font-semibold">Key Features</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-text-secondary flex items-start gap-2.5 text-sm"
                    >
                      <span className="bg-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Specifications
            </h2>
            <div className="border-border divide-border mt-8 divide-y rounded-lg border">
              {product.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-text-secondary text-sm font-medium">{spec.label}</span>
                  <span className="text-text-primary text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Downloads */}
      {product.downloads && product.downloads.length > 0 && (
        <section className="py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Downloads
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.downloads.map((file) =>
                file.fileUrl ? (
                  
                  <a  key={file.label}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="border-border hover:border-accent flex items-center gap-3 rounded-lg border p-4 transition-colors"
                  >
                    <div className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {file.label}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {file.fileType} · {file.fileSize}
                      </p>
                    </div>
                    <Download size={16} className="text-text-secondary shrink-0" />
                  </a>
                ) : (
                  <div
                    key={file.label}
                    aria-disabled="true"
                    title="File not available yet — contact us for a copy"
                    className="border-border flex cursor-not-allowed items-center gap-3 rounded-lg border p-4 opacity-50"
                  >
                    <div className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {file.label}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {file.fileType} · {file.fileSize} · Coming soon
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Related Products
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <Card key={related.slug} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    {related.images?.[0] ? (
                      <Image
                        src={related.images[0]}
                        alt={related.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{related.name}</CardTitle>
                    <CardDescription>{related.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/products/${related.slug}`}
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
    </>
  );
}