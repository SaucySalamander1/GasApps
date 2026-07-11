import { prisma } from '@/lib/prisma';
import { BlogPageClient } from './BlogPageClient';

// Blog posts are managed live from the admin panel, so this page always
// reads the current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const dbPosts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  const posts = dbPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    date: p.date,
    excerpt: p.excerpt,
    images: p.images,
  }));

  return <BlogPageClient posts={posts} />;
}