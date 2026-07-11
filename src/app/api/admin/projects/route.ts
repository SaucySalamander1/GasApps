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

  const projects = await prisma.project.findMany({
    include: { results: true },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const baseSlug = slugify(name);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Name must contain letters or numbers.' }, { status: 400 });
    }

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
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

    const project = await prisma.project.create({
      data: {
        slug,
        name: name.trim(),
        industry: industry.trim(),
        summary: summary.trim(),
        challenge: challenge.trim(),
        solution: solution.trim(),
        images,
        productSlugs,
        results: { create: results },
      },
      include: { results: true },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}