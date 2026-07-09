import dns from 'dns';
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

dns.setDefaultResultOrder('ipv4first');

import { products } from '@/data/products';
import { services } from '@/data/services';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildSystemPrompt() {
  const productList = products
    .map((p) => `- ${p.name} (${p.category}): ${p.description}`)
    .join('\n');
  const serviceList = services.map((s) => `- ${s.name}: ${s.summary}`).join('\n');

  return `You are a helpful assistant for GasApps, an industrial gas fittings and instrumentation company.

Answer questions ONLY using the information below. If you don't know the answer or it's not covered here, say so honestly and suggest the person use the "Request a Quote" button or Contact page for specifics you can't answer.

Never make up specifications, pricing, or availability that isn't listed below. Keep answers concise (2-4 sentences).

PRODUCTS:
${productList}

SERVICES:
${serviceList}
`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is not configured yet. Please contact us directly.' },
        { status: 503 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
      temperature: 0.3,
      max_tokens: 300,
    });

    const reply =
      completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
