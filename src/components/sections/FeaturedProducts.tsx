import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { products } from '@/data/products';

const featuredProducts = products.slice(0, 3);

export function FeaturedProducts() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Featured Products
            </h2>
            <p className="text-text-secondary mt-2 max-w-xl">
              A selection of our most requested fittings and instrumentation.
            </p>
          </div>
          <Link
            href="/products"
            className="text-accent flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.slug} className="overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <ImagePlaceholder className="h-48 w-full" />
              )}
              <CardHeader>
                <Badge variant="default" className="mb-2 w-fit">
                  {product.category}
                </Badge>
                <CardTitle>{product.name}</CardTitle>
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
  );
}
