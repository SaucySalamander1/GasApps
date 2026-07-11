import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString } from '@/lib/validation';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const certifications = await prisma.certification.findMany({ orderBy: { name: 'asc' } });

  return NextResponse.json({ certifications });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, name, category, description } = body;

    if (
      !isNonEmptyString(code) ||
      !isNonEmptyString(name) ||
      !isNonEmptyString(category) ||
      !isNonEmptyString(description)
    ) {
      return NextResponse.json(
        { error: 'Code, name, category, and description are required.' },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: {
        code: code.trim(),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    console.error('Create certification error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}