'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, MessageSquareQuote, Pencil, Trash2, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import { cn } from '@/utils/cn';
import TestimonialFormModal, { type TestimonialFormValues } from './TestimonialFormModal';

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
}

const STATUS_BADGE: Record<AdminTestimonial['status'], 'warning' | 'success' | 'default'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'default',
};

export default function TestimonialsManager() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<AdminTestimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data.testimonials ?? []);
    } catch {
      showToast('Could not load testimonials.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  async function updateStatus(testimonial: AdminTestimonial, status: AdminTestimonial['status']) {
    setBusyId(testimonial.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not update status.', 'error');
        return;
      }
      showToast(
        status === 'APPROVED' ? 'Testimonial approved — now live on the homepage.' : 'Testimonial rejected.',
        'success'
      );
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveEdit(values: TestimonialFormValues) {
    if (!editingTestimonial) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not save changes.', 'error');
        return;
      }
      showToast('Testimonial updated.', 'success');
      setEditingTestimonial(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(testimonial: AdminTestimonial) {
    if (!confirm(`Delete this testimonial from ${testimonial.name}? This can't be undone.`)) return;

    setBusyId(testimonial.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete testimonial.', 'error');
        return;
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));
      showToast('Testimonial deleted.', 'success');
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = testimonials.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="font-display text-text-primary text-3xl font-bold tracking-tight">
            Testimonials
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Review submissions from the public site. Approved reviews appear on the homepage.
            {pendingCount > 0 && (
              <span className="text-accent-amber font-medium"> {pendingCount} awaiting review.</span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={isLoading}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading testimonials&hellip;</p>
      ) : testimonials.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <MessageSquareQuote className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No submissions yet.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-text-secondary text-xs">
                    {testimonial.role}
                    {testimonial.company ? ` · ${testimonial.company}` : ''}
                  </div>
                </TableCell>
                <TableCell className="max-w-[280px] truncate">{testimonial.quote}</TableCell>
                <TableCell>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          'h-3.5 w-3.5',
                          n <= testimonial.rating
                            ? 'fill-accent-amber text-accent-amber'
                            : 'text-border'
                        )}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[testimonial.status]}>{testimonial.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {testimonial.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === testimonial.id}
                        onClick={() => updateStatus(testimonial, 'APPROVED')}
                        title="Approve"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {testimonial.status !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === testimonial.id}
                        onClick={() => updateStatus(testimonial, 'REJECTED')}
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTestimonial(testimonial)}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === testimonial.id}
                      onClick={() => handleDelete(testimonial)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingTestimonial && (
        <TestimonialFormModal
          isOpen={Boolean(editingTestimonial)}
          onClose={() => setEditingTestimonial(null)}
          onSave={handleSaveEdit}
          isSaving={isSaving}
          initialTestimonial={editingTestimonial}
        />
      )}
    </div>
  );
}