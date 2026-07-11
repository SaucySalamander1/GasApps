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
  const industry = await prisma.industry.findUnique({ where: { id } });

  if (!industry) {
    return NextResponse.json({ error: 'Industry not found.' }, { status: 404 });
  }

  return NextResponse.json({ industry });
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
    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Industry not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, summary, description } = body;

    if (!isNonEmptyString(name) || !isNonEmptyString(summary) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { error: 'Name, summary, and description are required.' },
        { status: 400 }
      );
    }

    // Only regenerate the slug if the name actually changed, so existing
    // links to this industry don't silently break.
    let slug = existing.slug;
    if (name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.industry.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const applications = Array.isArray(body.applications)
      ? body.applications.filter(isNonEmptyString)
      : [];

    const industry = await prisma.industry.update({
      where: { id },
      data: {
        slug,
        name: name.trim(),
        summary: summary.trim(),
        description: description.trim(),
        images,
        applications,
      },
    });

    return NextResponse.json({ industry });
  } catch (error) {
    console.error('Update industry error:', error);
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
    await prisma.industry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete industry error:', error);
    return NextResponse.json({ error: 'Could not delete this industry.' }, { status: 500 });
  }
}