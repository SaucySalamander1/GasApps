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

  const resources = await prisma.resource.findMany({ orderBy: { name: 'asc' } });

  return NextResponse.json({ resources });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const baseSlug = slugify(name);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Name must contain letters or numbers.' }, { status: 400 });
    }

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.resource.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const resource = await prisma.resource.create({
      data: {
        slug,
        name: name.trim(),
        category: category.trim(),
        fileType: fileType.trim(),
        fileSize: fileSize.trim(),
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}