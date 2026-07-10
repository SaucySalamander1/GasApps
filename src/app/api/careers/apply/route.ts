import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isNonEmptyString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, position, message } = body ?? {};

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(message)) {
      return NextResponse.json(
        { error: 'Name, a valid email, and a message are required.' },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        position: isNonEmptyString(position) ? position.trim() : 'General application',
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}