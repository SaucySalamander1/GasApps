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
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
  }

  return NextResponse.json({ job });
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
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { title, department, location, type } = body;

    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(department) ||
      !isNonEmptyString(location) ||
      !isNonEmptyString(type)
    ) {
      return NextResponse.json(
        { error: 'Title, department, location, and type are required.' },
        { status: 400 }
      );
    }

    // Only regenerate the slug if the title actually changed, so existing
    // links to this posting don't silently break.
    let slug = existing.slug;
    if (title.trim() !== existing.title) {
      const baseSlug = slugify(title);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.job.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        slug,
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        type: type.trim(),
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Update job error:', error);
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
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Could not delete this job posting.' }, { status: 500 });
  }
}