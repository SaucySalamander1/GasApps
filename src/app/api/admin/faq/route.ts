import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString } from '@/lib/validation';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.faqItem.findMany({ orderBy: { createdAt: 'asc' } });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer, category } = body;

    if (!isNonEmptyString(question) || !isNonEmptyString(answer) || !isNonEmptyString(category)) {
      return NextResponse.json(
        { error: 'Question, answer, and category are required.' },
        { status: 400 }
      );
    }

    const item = await prisma.faqItem.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}