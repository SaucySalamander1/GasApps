import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isNonEmptyString, optionalString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, itemName, message } = body ?? {};

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(message)) {
      return NextResponse.json(
        { error: 'Name, a valid email, and a message are required.' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.serviceRequest.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        itemName: isNonEmptyString(itemName) ? itemName.trim() : 'General inquiry',
        message: optionalString(message),
      },
    });

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error('Service request error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}