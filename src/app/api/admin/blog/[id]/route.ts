import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString } from '@/lib/validation';
import { slugify } from '@/utils/format';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

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

    // Only regenerate the slug if the title actually changed, so existing
    // links to this post don't silently break.
    let slug = existing.slug;
    if (title.trim() !== existing.title) {
      const baseSlug = slugify(title);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const content = Array.isArray(body.content) ? body.content.filter(isNonEmptyString) : [];

    const post = await prisma.blogPost.update({
      where: { id },
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

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Could not delete this post.' }, { status: 500 });
  }
}