import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const certification = await prisma.certification.findUnique({ where: { id } });

  if (!certification) {
    return NextResponse.json({ error: 'Certification not found.' }, { status: 404 });
  }

  return NextResponse.json({ certification });
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
    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Certification not found.' }, { status: 404 });
    }

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

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        code: code.trim(),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json({ certification });
  } catch (error) {
    console.error('Update certification error:', error);
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
    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete certification error:', error);
    return NextResponse.json({ error: 'Could not delete this certification.' }, { status: 500 });
  }
}