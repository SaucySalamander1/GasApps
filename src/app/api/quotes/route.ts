import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isNonEmptyString, optionalString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, productOrService, quantity, message } = body ?? {};

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(productOrService)) {
      return NextResponse.json(
        { error: 'Name, a valid email, and a product or service are required.' },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        company: optionalString(company),
        productOrService: productOrService.trim(),
        quantity: optionalString(quantity),
        message: optionalString(message),
      },
    });

    return NextResponse.json({ success: true, id: quote.id }, { status: 201 });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}