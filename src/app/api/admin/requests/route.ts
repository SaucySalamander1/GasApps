import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllLeads, LEAD_TYPES, type LeadType } from '@/lib/admin-requests';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');

  let leads = await getAllLeads();

  if (typeParam && LEAD_TYPES.includes(typeParam as LeadType)) {
    leads = leads.filter((lead) => lead.type === typeParam);
  }

  if (statusParam) {
    leads = leads.filter((lead) => lead.status === statusParam);
  }

  return NextResponse.json({ leads });
}