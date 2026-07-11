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
  const item = await prisma.faqItem.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json({ error: 'FAQ item not found.' }, { status: 404 });
  }

  return NextResponse.json({ item });
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
    const existing = await prisma.faqItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'FAQ item not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { question, answer, category } = body;

    if (!isNonEmptyString(question) || !isNonEmptyString(answer) || !isNonEmptyString(category)) {
      return NextResponse.json(
        { error: 'Question, answer, and category are required.' },
        { status: 400 }
      );
    }

    const item = await prisma.faqItem.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Update FAQ error:', error);
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
    await prisma.faqItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    return NextResponse.json({ error: 'Could not delete this FAQ item.' }, { status: 500 });
  }
}