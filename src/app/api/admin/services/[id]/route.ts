import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString, optionalString } from '@/lib/validation';
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
  const service = await prisma.service.findUnique({
    where: { id },
    include: { process: { orderBy: { order: 'asc' } } },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
  }

  return NextResponse.json({ service });
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
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
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
    // links to this service don't silently break.
    let slug = existing.slug;
    if (name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.service.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const features = Array.isArray(body.features) ? body.features.filter(isNonEmptyString) : [];
    const certificationCodes = Array.isArray(body.certificationCodes)
      ? body.certificationCodes.filter(isNonEmptyString)
      : [];
    const process = Array.isArray(body.process)
      ? body.process
          .filter((s: unknown) => isNonEmptyString((s as { title?: unknown })?.title))
          .map((s: { title: string; description: string }, i: number) => ({
            title: s.title,
            description: s.description ?? '',
            order: i,
          }))
      : [];

    // Process steps are simplest to fully replace rather than diff, since
    // the admin form always submits the complete current ordered list.
    const service = await prisma.service.update({
      where: { id },
      data: {
        slug,
        name: name.trim(),
        summary: summary.trim(),
        description: description.trim(),
        images,
        features,
        certificationCodes,
        duration: optionalString(body.duration),
        coverageArea: optionalString(body.coverageArea),
        process: { deleteMany: {}, create: process },
      },
      include: { process: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Update service error:', error);
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
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Could not delete this service.' }, { status: 500 });
  }
}