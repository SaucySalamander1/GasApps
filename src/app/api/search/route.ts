import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface SearchResult {
  label: string;
  category: string;
  href: string;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [products, services, industries, blogPosts] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { name: true, slug: true },
      take: 5,
    }),
    prisma.service.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { name: true, slug: true },
      take: 5,
    }),
    prisma.industry.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { name: true, slug: true },
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      select: { title: true, slug: true },
      take: 5,
    }),
  ]);

  const results: SearchResult[] = [
    ...products.map((p) => ({ label: p.name, category: 'Products', href: `/products/${p.slug}` })),
    ...services.map((s) => ({ label: s.name, category: 'Services', href: `/services/${s.slug}` })),
    ...industries.map((i) => ({ label: i.name, category: 'Industries', href: `/industries/${i.slug}` })),
    ...blogPosts.map((b) => ({ label: b.title, category: 'Blog', href: `/blog/${b.slug}` })),
  ];

  return NextResponse.json({ results });
}