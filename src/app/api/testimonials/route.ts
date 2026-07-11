import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isNonEmptyString, optionalString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, quote, rating } = body ?? {};

    if (!isNonEmptyString(name) || !isNonEmptyString(role) || !isNonEmptyString(quote)) {
      return NextResponse.json(
        { error: 'Name, role, and your review are required.' },
        { status: 400 }
      );
    }

    const parsedRating = Number(rating);
    const safeRating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
      ? parsedRating
      : 5;

    // New submissions always start as PENDING — nothing shows publicly until
    // an admin approves it from the moderation queue.
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        company: optionalString(company),
        quote: quote.trim(),
        rating: safeRating,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, id: testimonial.id }, { status: 201 });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}