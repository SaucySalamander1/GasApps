import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString, optionalString } from '@/lib/validation';
import { slugify } from '@/utils/format';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    include: { process: { orderBy: { order: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ services });
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
    while (await prisma.service.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
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

    const service = await prisma.service.create({
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
        process: { create: process },
      },
      include: { process: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}