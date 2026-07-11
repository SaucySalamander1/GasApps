import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { prisma } from '@/lib/prisma';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Blog posts are managed live from the admin panel, so this page always
// reads the current DB state rather than pre-rendering a fixed set of slugs.
export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) {
    notFound();
  }

  const otherPosts = await prisma.blogPost.findMany({
    where: { slug: { not: post.slug } },
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

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

          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-lg md:h-96">
            {post.images?.[0] ? (
              <Image
                src={post.images[0]}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder className="h-full w-full" />
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
                  <div className="relative h-40 w-full">
                    {other.images?.[0] ? (
                      <Image
                        src={other.images[0]}
                        alt={other.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" />
                    )}
                  </div>
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