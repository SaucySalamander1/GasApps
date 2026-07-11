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

  const products = await prisma.product.findMany({
    include: { specifications: true, downloads: true },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, description } = body;

    if (!isNonEmptyString(name) || !isNonEmptyString(category) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { error: 'Name, category, and description are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Name must contain letters or numbers.' }, { status: 400 });
    }

    // Ensure slug uniqueness by appending a numeric suffix if needed.
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const images = Array.isArray(body.images) ? body.images.filter(isNonEmptyString) : [];
    const industries = Array.isArray(body.industries) ? body.industries.filter(isNonEmptyString) : [];
    const certificationCodes = Array.isArray(body.certificationCodes)
      ? body.certificationCodes.filter(isNonEmptyString)
      : [];
    const features = Array.isArray(body.features) ? body.features.filter(isNonEmptyString) : [];
    const specifications = Array.isArray(body.specifications)
      ? body.specifications
          .filter((s: unknown) => isNonEmptyString((s as { label?: unknown })?.label))
          .map((s: { label: string; value: string }) => ({ label: s.label, value: s.value ?? '' }))
      : [];
    const downloads = Array.isArray(body.downloads)
      ? body.downloads
          .filter((d: unknown) => isNonEmptyString((d as { label?: unknown })?.label))
          .map((d: { label: string; fileType: string; fileSize: string; fileUrl?: string }) => ({
            label: d.label,
            fileType: d.fileType ?? '',
            fileSize: d.fileSize ?? '',
            fileUrl: isNonEmptyString(d.fileUrl) ? d.fileUrl.trim() : null,
          }))
      : [];

    const product = await prisma.product.create({
      data: {
        slug,
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        images,
        industries,
        leadTime: optionalString(body.leadTime),
        warranty: optionalString(body.warranty),
        certificationCodes,
        features,
        specifications: { create: specifications },
        downloads: { create: downloads },
      },
      include: { specifications: true, downloads: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}