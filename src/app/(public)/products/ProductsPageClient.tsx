'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Pagination } from '@/components/ui/Pagination';
import { categories } from '@/data/products';
import type { Product } from '@/types/product';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 6;

type SortOption = 'name-asc' | 'name-desc' | 'category';

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sort, setSort] = useState<SortOption>('name-asc');

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    const sorted = [...result].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      return a.category.localeCompare(b.category);
    });

    return sorted;
  }, [products, query, activeCategory, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(pageFromUrl, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetToFirstPage() {
    router.replace('/products');
  }

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    resetToFirstPage();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    resetToFirstPage();
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Precision gas fittings and instrumentation for industrial applications."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    activeCategory === category
                      ? 'border-accent bg-accent text-white'
                      : 'border-border text-text-secondary hover:border-accent'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="relative w-full sm:w-64">
                <SearchIcon
                  size={16}
                  className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="border-border bg-background text-text-primary rounded-md border px-3 text-sm"
              >
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          <p className="text-text-secondary mt-6 text-sm">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </p>

          {paginated.length === 0 ? (
            <div className="border-border mt-6 rounded-lg border py-16 text-center">
              <p className="text-text-secondary">No products match your search.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((product) => (
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
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/products"
              className="mt-10"
            />
          )}
        </Container>
      </section>
    </>
  );
}
