'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Briefcase, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import JobFormModal, { type JobFormValues } from './JobFormModal';

export interface AdminJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  updatedAt: string;
}

export default function JobsManager() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/jobs');
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } catch {
      showToast('Could not load job postings.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingJob(null);
    setIsModalOpen(true);
  }

  function openEdit(job: AdminJob) {
    setEditingJob(job);
    setIsModalOpen(true);
  }

  async function handleSave(values: JobFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingJob);
      const url = isEdit ? `/api/admin/jobs/${editingJob!.id}` : '/api/admin/jobs';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save job posting.', 'error');
        return;
      }

      showToast(isEdit ? 'Job posting updated.' : 'Job posting created.', 'success');
      setIsModalOpen(false);
      setEditingJob(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(job: AdminJob) {
    if (!confirm(`Delete "${job.title}"? This can't be undone.`)) return;

    setDeletingId(job.id);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete job posting.', 'error');
        return;
      }
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      showToast('Job posting deleted.', 'success');
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="font-display text-text-primary text-3xl font-bold tracking-tight">
            Jobs
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage open positions shown on the public Careers page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Posting
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading job postings&hellip;</p>
      ) : jobs.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Briefcase className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No open positions yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first posting
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell className="text-text-secondary text-xs">{job.department}</TableCell>
                <TableCell className="text-text-secondary text-xs">{job.location}</TableCell>
                <TableCell>
                  <Badge variant="default">{job.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(job)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === job.id}
                      onClick={() => handleDelete(job)}
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

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialJob={editingJob}
      />
    </div>
  );
}