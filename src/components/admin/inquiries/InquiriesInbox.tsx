'use client';

import { useEffect, useMemo, useState, useCallback, Fragment } from 'react';
import { RefreshCw, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

type LeadType = 'quote' | 'service' | 'contact' | 'application';
type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  headline: string;
  detail: string | null;
  status: LeadStatus;
  createdAt: string;
}

const TYPE_LABEL: Record<LeadType, string> = {
  quote: 'Quote',
  service: 'Service Request',
  contact: 'Contact',
  application: 'Application',
};

const TYPE_FILTERS: { value: 'all' | LeadType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'quote', label: 'Quotes' },
  { value: 'service', label: 'Service Requests' },
  { value: 'contact', label: 'Contact' },
  { value: 'application', label: 'Applications' },
];

const STATUS_BADGE: Record<LeadStatus, { label: string; variant: 'accent' | 'warning' | 'success' }> = {
  NEW: { label: 'New', variant: 'accent' },
  IN_PROGRESS: { label: 'In Progress', variant: 'warning' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
};

export default function InquiriesInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | LeadType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      setLeads(data.leads ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
        load();
    }, [load]);

  const filtered = useMemo(
    () => (typeFilter === 'all' ? leads : leads.filter((l) => l.type === typeFilter)),
    [leads, typeFilter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const lead of leads) c[lead.type] = (c[lead.type] ?? 0) + 1;
    return c;
  }, [leads]);

  async function updateStatus(lead: Lead, status: LeadStatus) {
    setUpdatingId(lead.id);
    try {
      const res = await fetch(`/api/admin/requests/${lead.type}/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <h1 className="font-display text-text-primary text-3xl font-bold tracking-tight">
            Inquiries
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Quotes, service requests, contact messages, and job applications submitted through the
            site &mdash; all in one place.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={isLoading}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </section>

      <div className="border-border flex flex-wrap items-center gap-1 border-b">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? 'border-accent text-text-primary'
                : 'text-text-secondary hover:text-text-primary border-transparent'
            }`}
          >
            {f.label}
            {counts[f.value] ? (
              <span className="text-text-secondary ml-1.5 text-xs">({counts[f.value]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading inquiries&hellip;</p>
      ) : filtered.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Mail className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">Nothing here yet.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Regarding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => {
              const isExpanded = expandedId === lead.id;
              const badge = STATUS_BADGE[lead.status];
              return (
                <Fragment key={lead.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  >
                    <TableCell>
                      <Badge variant="default">{TYPE_LABEL[lead.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-text-secondary text-xs">{lead.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate">{lead.headline}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary text-xs">
                      {new Date(lead.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-surface/50">
                        <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-start sm:justify-between">
                          <p className="text-text-secondary max-w-2xl text-sm whitespace-pre-wrap">
                            {lead.detail || 'No additional message provided.'}
                          </p>
                          <div className="flex shrink-0 gap-2">
                            {(['NEW', 'IN_PROGRESS', 'RESOLVED'] as LeadStatus[]).map((s) => (
                              <Button
                                key={s}
                                size="sm"
                                variant={lead.status === s ? 'default' : 'outline'}
                                disabled={updatingId === lead.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(lead, s);
                                }}
                              >
                                {STATUS_BADGE[s].label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}