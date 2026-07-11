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

  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const baseSlug = slugify(title);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Title must contain letters or numbers.' }, { status: 400 });
    }

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.job.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const job = await prisma.job.create({
      data: {
        slug,
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        type: type.trim(),
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}