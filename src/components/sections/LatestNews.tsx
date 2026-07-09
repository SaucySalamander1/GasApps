import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { blogPosts } from '@/data/blog';

const latestPosts = blogPosts.slice(0, 3);

export function LatestNews() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Latest News
            </h2>
            <p className="text-text-secondary mt-2 max-w-xl">
              Engineering insights, safety updates, and company announcements.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-accent flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            View all articles
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden">
              {post.images?.[0] ? (
                <img src={post.images[0]} alt={post.title} className="h-44 w-full object-cover" />
              ) : (
                <ImagePlaceholder className="h-44 w-full" />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="default">{post.category}</Badge>
                  <span className="text-text-secondary text-xs">{post.date}</span>
                </div>
                <CardTitle className="mt-2 text-base">{post.title}</CardTitle>
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
      </Container>
    </section>
  );
}
