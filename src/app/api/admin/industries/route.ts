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

  const industries = await prisma.industry.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ industries });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, summary, description } = body;

    if (!isNonEmptyString(name) || !isNonEmptyString(summary) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { error: 'Name, summary, and description are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Name must contain letters or numbers.' }, { status: 400 });
    }

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.industry.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const applications = Array.isArray(body.applications)
      ? body.applications.filter(isNonEmptyString)
      : [];

    const industry = await prisma.industry.create({
      data: {
        slug,
        name: name.trim(),
        summary: summary.trim(),
        description: description.trim(),
        images,
        applications,
      },
    });

    return NextResponse.json({ industry }, { status: 201 });
  } catch (error) {
    console.error('Create industry error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}