import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString } from '@/lib/validation';
import { slugify } from '@/utils/format';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, date, excerpt } = body;

    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(category) ||
      !isNonEmptyString(date) ||
      !isNonEmptyString(excerpt)
    ) {
      return NextResponse.json(
        { error: 'Title, category, date, and excerpt are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Title must contain letters or numbers.' }, { status: 400 });
    }

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const content = Array.isArray(body.content) ? body.content.filter(isNonEmptyString) : [];

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: title.trim(),
        category: category.trim(),
        date: date.trim(),
        excerpt: excerpt.trim(),
        images,
        content,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}