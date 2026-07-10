import dns from 'dns';
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSession } from '@/lib/auth';
import { getAllLeads } from '@/lib/admin-requests';
import { getDashboardStats } from '@/lib/dashboard-stats';

dns.setDefaultResultOrder('ipv4first');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function summarizeLeads(leads: Awaited<ReturnType<typeof getAllLeads>>) {
  const open = leads.filter((l) => l.status !== 'RESOLVED');
  if (open.length === 0) return 'There are no open (New or In Progress) requests right now.';

  return open
    .slice(0, 40) // keep the prompt bounded even if the inbox is large
    .map(
      (l) =>
        `- [${l.type.toUpperCase()}] #${l.id.slice(-6)} \u2014 ${l.name} <${l.email}> \u2014 "${l.headline}" \u2014 status: ${l.status} \u2014 received: ${l.createdAt.toISOString().slice(0, 10)}${l.detail ? ` \u2014 message: "${l.detail.slice(0, 200)}"` : ''}`
    )
    .join('\n');
}

async function buildSystemPrompt() {
  const [leads, stats] = await Promise.all([getAllLeads(), getDashboardStats()]);

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'NEW').length,
    inProgress: leads.filter((l) => l.status === 'IN_PROGRESS').length,
    resolved: leads.filter((l) => l.status === 'RESOLVED').length,
  };

  return `You are the internal AI assistant for GasApps' admin team, embedded in their admin dashboard. You help staff triage inbound leads and understand site content stats. You are NOT customer-facing \u2014 you're talking to a GasApps employee.

You can:
- Summarize open quotes, service requests, contact messages, and job applications
- Draft reply emails to a specific request when asked (write ONLY the email body, no extra commentary, unless asked otherwise)
- Answer questions about the counts/stats below
- Suggest which requests look most urgent or highest-value, based only on what's actually in the data

Never invent requests, names, emails, or numbers that aren't in the data below. If something isn't covered, say so plainly.

INBOX SUMMARY: ${counts.total} total requests \u2014 ${counts.new} new, ${counts.inProgress} in progress, ${counts.resolved} resolved.

OPEN REQUESTS:
${summarizeLeads(leads)}

SITE CONTENT STATS: ${stats.totalProducts} products, ${stats.totalServices} services, ${stats.publishedPosts} blog posts, ${stats.openRoles} open job listings, ${stats.totalContentItems} total content items.

Keep replies concise and practical \u2014 this is a busy staff member, not a chat with a customer.`;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI assistant is not configured. Add GROQ_API_KEY to your environment.' },
        { status: 503 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.3,
      max_tokens: 600,
    });

    const reply =
      completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Admin AI error:', error);
    return NextResponse.json(
      { error: 'Something went wrong talking to the AI assistant. Please try again.' },
      { status: 500 }
    );
  }
}