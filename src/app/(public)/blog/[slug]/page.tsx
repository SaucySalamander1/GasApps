import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { blogPosts } from '@/data/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <section className="border-border border-b py-8">
        <Container>
          <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
        </Container>
      </section>

      <section className="py-[var(--space-section-y)]">
        <Container className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <Badge variant="default">{post.category}</Badge>
            <span className="text-text-secondary text-sm">{post.date}</span>
          </div>

          <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-8">
            {post.images?.[0] ? (
              <img
                src={post.images[0]}
                alt={post.title}
                className="h-72 w-full rounded-lg object-cover md:h-96"
              />
            ) : (
              <ImagePlaceholder className="h-72 w-full rounded-lg md:h-96" />
            )}
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-text-secondary text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/blog"
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </Container>
      </section>

      {otherPosts.length > 0 && (
        <section className="bg-surface/50 py-[var(--space-section-y)]">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              More Articles
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherPosts.map((other) => (
                <Card key={other.slug} className="overflow-hidden">
                  {other.images?.[0] ? (
                    <img
                      src={other.images[0]}
                      alt={other.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-40 w-full" />
                  )}
                  <CardHeader>
                    <Badge variant="default" className="mb-2 w-fit">
                      {other.category}
                    </Badge>
                    <CardTitle className="text-base">{other.title}</CardTitle>
                    <CardDescription>{other.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      href={`/blog/${other.slug}`}
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
      )}
    </>
  );
}
