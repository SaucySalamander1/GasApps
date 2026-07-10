import { prisma } from '@/lib/prisma';
import type { RequestStatus } from '@prisma/client';

export type LeadType = 'quote' | 'service' | 'contact' | 'application';

export const LEAD_TYPES: LeadType[] = ['quote', 'service', 'contact', 'application'];

export interface NormalizedLead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  headline: string; // what they're asking about, at a glance
  detail: string | null; // free-text message, if any
  status: RequestStatus;
  createdAt: Date;
}

/** Fetches every quote, service request, contact message, and job application. */
export async function getAllLeads(): Promise<NormalizedLead[]> {
  const [quotes, services, contacts, applications] = await Promise.all([
    prisma.quoteRequest.findMany(),
    prisma.serviceRequest.findMany(),
    prisma.contactMessage.findMany(),
    prisma.jobApplication.findMany(),
  ]);

  const normalized: NormalizedLead[] = [
    ...quotes.map((q) => ({
      id: q.id,
      type: 'quote' as const,
      name: q.name,
      email: q.email,
      headline: q.productOrService,
      detail: q.message,
      status: q.status,
      createdAt: q.createdAt,
    })),
    ...services.map((s) => ({
      id: s.id,
      type: 'service' as const,
      name: s.name,
      email: s.email,
      headline: s.itemName,
      detail: s.message,
      status: s.status,
      createdAt: s.createdAt,
    })),
    ...contacts.map((c) => ({
      id: c.id,
      type: 'contact' as const,
      name: c.name,
      email: c.email,
      headline: c.subject ?? 'General inquiry',
      detail: c.message,
      status: c.status,
      createdAt: c.createdAt,
    })),
    ...applications.map((a) => ({
      id: a.id,
      type: 'application' as const,
      name: a.name,
      email: a.email,
      headline: a.position,
      detail: a.message,
      status: a.status,
      createdAt: a.createdAt,
    })),
  ];

  return normalized.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function delegateFor(type: LeadType) {
  switch (type) {
    case 'quote':
      return prisma.quoteRequest;
    case 'service':
      return prisma.serviceRequest;
    case 'contact':
      return prisma.contactMessage;
    case 'application':
      return prisma.jobApplication;
  }
}

export async function updateLeadStatus(type: LeadType, id: string, status: RequestStatus) {
  const delegate = delegateFor(type);
  // @ts-expect-error -- each delegate's update signature differs only in the
  // where/data payload shape, which is identical (id + status) across all four models.
  return delegate.update({ where: { id }, data: { status } });
}