'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Wrench, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import ServiceFormModal, { type ServiceFormValues } from './ServiceFormModal';

export interface AdminService {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  features: string[];
  images: string[];
  duration: string | null;
  coverageArea: string | null;
  certificationCodes: string[];
  process: { id: string; title: string; description: string; order: number }[];
  updatedAt: string;
}

export default function ServicesManager() {
  const { showToast } = useToast();
  const [services, setServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data.services ?? []);
    } catch {
      showToast('Could not load services.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingService(null);
    setIsModalOpen(true);
  }

  function openEdit(service: AdminService) {
    setEditingService(service);
    setIsModalOpen(true);
  }

  async function handleSave(values: ServiceFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingService);
      const url = isEdit ? `/api/admin/services/${editingService!.id}` : '/api/admin/services';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save service.', 'error');
        return;
      }

      showToast(isEdit ? 'Service updated.' : 'Service created.', 'success');
      setIsModalOpen(false);
      setEditingService(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(service: AdminService) {
    if (!confirm(`Delete "${service.name}"? This can't be undone.`)) return;

    setDeletingId(service.id);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete service.', 'error');
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      showToast('Service deleted.', 'success');
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
            Services
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage the services shown on the public site, including their process steps.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Service
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading services&hellip;</p>
      ) : services.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Wrench className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No services yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first service
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-text-secondary text-xs">/{service.slug}</div>
                </TableCell>
                <TableCell className="max-w-[240px] truncate">{service.summary}</TableCell>
                <TableCell>
                  <Badge variant="accent">{service.process.length} steps</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {service.duration || '—'}
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(service.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(service)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === service.id}
                      onClick={() => handleDelete(service)}
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

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialService={editingService}
      />
    </div>
  );
}