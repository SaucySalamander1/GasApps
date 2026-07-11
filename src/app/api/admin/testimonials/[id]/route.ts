import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isNonEmptyString, optionalString } from '@/lib/validation';

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

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
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
    }

    const body = await request.json();

    // Two use cases share this route: a quick status change from the
    // moderation queue (only `status` sent), or a full edit (all fields).
    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.name !== undefined || body.role !== undefined || body.quote !== undefined) {
      if (!isNonEmptyString(body.name) || !isNonEmptyString(body.role) || !isNonEmptyString(body.quote)) {
        return NextResponse.json(
          { error: 'Name, role, and quote are required.' },
          { status: 400 }
        );
      }
      data.name = body.name.trim();
      data.role = body.role.trim();
      data.quote = body.quote.trim();
      data.company = optionalString(body.company);

      const parsedRating = Number(body.rating);
      data.rating =
        Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
          ? parsedRating
          : existing.rating;
    }

    const testimonial = await prisma.testimonial.update({ where: { id }, data });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
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
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Could not delete this testimonial.' }, { status: 500 });
  }
}