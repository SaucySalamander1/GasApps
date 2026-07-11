'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Factory, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import IndustryFormModal, { type IndustryFormValues } from './IndustryFormModal';

export interface AdminIndustry {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  applications: string[];
  images: string[];
  updatedAt: string;
}

export default function IndustriesManager() {
  const { showToast } = useToast();
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<AdminIndustry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/industries');
      const data = await res.json();
      setIndustries(data.industries ?? []);
    } catch {
      showToast('Could not load industries.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingIndustry(null);
    setIsModalOpen(true);
  }

  function openEdit(industry: AdminIndustry) {
    setEditingIndustry(industry);
    setIsModalOpen(true);
  }

  async function handleSave(values: IndustryFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingIndustry);
      const url = isEdit ? `/api/admin/industries/${editingIndustry!.id}` : '/api/admin/industries';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save industry.', 'error');
        return;
      }

      showToast(isEdit ? 'Industry updated.' : 'Industry created.', 'success');
      setIsModalOpen(false);
      setEditingIndustry(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(industry: AdminIndustry) {
    if (!confirm(`Delete "${industry.name}"? This can't be undone.`)) return;

    setDeletingId(industry.id);
    try {
      const res = await fetch(`/api/admin/industries/${industry.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete industry.', 'error');
        return;
      }
      setIndustries((prev) => prev.filter((i) => i.id !== industry.id));
      showToast('Industry deleted.', 'success');
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
            Industries
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage the industries shown on the public site and which applications they cover.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Industry
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading industries&hellip;</p>
      ) : industries.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Factory className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No industries yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first industry
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.map((industry) => (
              <TableRow key={industry.id}>
                <TableCell>
                  <div className="font-medium">{industry.name}</div>
                  <div className="text-text-secondary text-xs">/{industry.slug}</div>
                </TableCell>
                <TableCell className="max-w-[240px] truncate">{industry.summary}</TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {industry.applications.length}
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(industry.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(industry)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === industry.id}
                      onClick={() => handleDelete(industry)}
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

      <IndustryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndustry(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialIndustry={editingIndustry}
      />
    </div>
  );
}