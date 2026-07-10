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
  const product = await prisma.product.findUnique({
    where: { id },
    include: { specifications: true, downloads: true },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ product });
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
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, category, description } = body;

    if (!isNonEmptyString(name) || !isNonEmptyString(category) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { error: 'Name, category, and description are required.' },
        { status: 400 }
      );
    }

    // Only regenerate the slug if the name actually changed, so existing
    // links to this product (and any bookmarks) don't silently break.
    let slug = existing.slug;
    if (name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug;
      let suffix = 1;
      while (await prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
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
          .map((d: { label: string; fileType: string; fileSize: string }) => ({
            label: d.label,
            fileType: d.fileType ?? '',
            fileSize: d.fileSize ?? '',
          }))
      : [];

    // Specs/downloads are simplest to fully replace rather than diff, since
    // the admin form always submits the complete current list.
    const product = await prisma.product.update({
      where: { id },
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
        specifications: { deleteMany: {}, create: specifications },
        downloads: { deleteMany: {}, create: downloads },
      },
      include: { specifications: true, downloads: true },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Could not delete this product.' }, { status: 500 });
  }
}