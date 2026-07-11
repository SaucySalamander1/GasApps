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
  const resource = await prisma.resource.findUnique({ where: { id } });

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
  }

  return NextResponse.json({ resource });
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
    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, category, fileType, fileSize } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(category) ||
      !isNonEmptyString(fileType) ||
      !isNonEmptyString(fileSize)
    ) {
      return NextResponse.json(
        { error: 'Name, category, file type, and file size are required.' },
        { status: 400 }
      );
    }

    // Only regenerate the slug if the name actually changed, so existing
    // links to this resource don't silently break.
    let slug = existing.slug;
    if (name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.resource.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        slug,
        name: name.trim(),
        category: category.trim(),
        fileType: fileType.trim(),
        fileSize: fileSize.trim(),
      },
    });

    return NextResponse.json({ resource });
  } catch (error) {
    console.error('Update resource error:', error);
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
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete resource error:', error);
    return NextResponse.json({ error: 'Could not delete this resource.' }, { status: 500 });
  }
}