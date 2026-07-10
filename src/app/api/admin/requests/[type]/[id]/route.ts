import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateLeadStatus, LEAD_TYPES, type LeadType } from '@/lib/admin-requests';

const VALID_STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;

  if (!LEAD_TYPES.includes(type as LeadType)) {
    return NextResponse.json({ error: 'Unknown request type' }, { status: 400 });
  }

  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const updated = await updateLeadStatus(type as LeadType, id, status);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Update lead status error:', error);
    return NextResponse.json({ error: 'Could not update this request' }, { status: 500 });
  }
}