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
  const project = await prisma.project.findUnique({
    where: { id },
    include: { results: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ project });
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
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, industry, summary, challenge, solution } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(industry) ||
      !isNonEmptyString(summary) ||
      !isNonEmptyString(challenge) ||
      !isNonEmptyString(solution)
    ) {
      return NextResponse.json(
        { error: 'Name, industry, summary, challenge, and solution are required.' },
        { status: 400 }
      );
    }

    // Only regenerate the slug if the name actually changed, so existing
    // links to this project don't silently break.
    let slug = existing.slug;
    if (name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.project.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const productSlugs = Array.isArray(body.productSlugs)
      ? body.productSlugs.filter(isNonEmptyString)
      : [];
    const results = Array.isArray(body.results)
      ? body.results
          .filter((r: unknown) => isNonEmptyString((r as { metric?: unknown })?.metric))
          .map((r: { metric: string; value: string }) => ({ metric: r.metric, value: r.value ?? '' }))
      : [];

    // Results are simplest to fully replace rather than diff, since the
    // admin form always submits the complete current list.
    const project = await prisma.project.update({
      where: { id },
      data: {
        slug,
        name: name.trim(),
        industry: industry.trim(),
        summary: summary.trim(),
        challenge: challenge.trim(),
        solution: solution.trim(),
        images,
        productSlugs,
        results: { deleteMany: {}, create: results },
      },
      include: { results: true },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Could not delete this project.' }, { status: 500 });
  }
}