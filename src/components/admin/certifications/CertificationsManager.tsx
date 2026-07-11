'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import CertificationFormModal, { type CertificationFormValues } from './CertificationFormModal';

export interface AdminCertification {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  updatedAt: string;
}

export default function CertificationsManager() {
  const { showToast } = useToast();
  const [certifications, setCertifications] = useState<AdminCertification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<AdminCertification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/certifications');
      const data = await res.json();
      setCertifications(data.certifications ?? []);
    } catch {
      showToast('Could not load certifications.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingCertification(null);
    setIsModalOpen(true);
  }

  function openEdit(certification: AdminCertification) {
    setEditingCertification(certification);
    setIsModalOpen(true);
  }

  async function handleSave(values: CertificationFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingCertification);
      const url = isEdit
        ? `/api/admin/certifications/${editingCertification!.id}`
        : '/api/admin/certifications';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save certification.', 'error');
        return;
      }

      showToast(isEdit ? 'Certification updated.' : 'Certification created.', 'success');
      setIsModalOpen(false);
      setEditingCertification(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(certification: AdminCertification) {
    if (!confirm(`Delete "${certification.name}"? This can't be undone.`)) return;

    setDeletingId(certification.id);
    try {
      const res = await fetch(`/api/admin/certifications/${certification.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete certification.', 'error');
        return;
      }
      setCertifications((prev) => prev.filter((c) => c.id !== certification.id));
      showToast('Certification deleted.', 'success');
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
            Certifications
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage the certifications and compliance badges shown on the public site.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Certification
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">
          Loading certifications&hellip;
        </p>
      ) : certifications.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <ShieldCheck className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No certifications yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first certification
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((certification) => (
              <TableRow key={certification.id}>
                <TableCell>
                  <Badge variant="success">{certification.code}</Badge>
                </TableCell>
                <TableCell className="font-medium">{certification.name}</TableCell>
                <TableCell>
                  <Badge variant="default">{certification.category}</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(certification.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(certification)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === certification.id}
                      onClick={() => handleDelete(certification)}
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

      <CertificationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCertification(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialCertification={editingCertification}
      />
    </div>
  );
}