'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { blogPosts, blogCategories } from '@/data/blog';
import { cn } from '@/utils/cn';

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof blogCategories)[number]>('All');

  const filtered = useMemo(() => {
    let result = blogPosts;

    if (activeCategory !== 'All') {
      result = result.filter((post) => post.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (post) => post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [query, activeCategory]);

  return (
    <>
      <PageHeader
        title="Blog"
        description="Engineering insights, safety updates, and company announcements."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
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

            <div className="relative w-full md:w-64">
              <SearchIcon
                size={16}
                className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-9"
              />
            </div>
          </div>

          <p className="text-text-secondary mt-6 text-sm">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
          </p>

          {filtered.length === 0 ? (
            <div className="border-border mt-6 rounded-lg border py-16 text-center">
              <p className="text-text-secondary">No articles match your search.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {filtered.map((post) => (
                <Card key={post.slug} className="overflow-hidden">
                  {post.images?.[0] ? (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-44 w-full" />
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{post.category}</Badge>
                      <span className="text-text-secondary text-xs">{post.date}</span>
                    </div>
                    <CardTitle className="mt-2 text-base">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-accent text-sm font-medium hover:underline"
                    >
                      Read article →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
