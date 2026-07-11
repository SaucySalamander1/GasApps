'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Download, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import ResourceFormModal, { type ResourceFormValues } from './ResourceFormModal';

export interface AdminResource {
  id: string;
  slug: string;
  name: string;
  category: string;
  fileType: string;
  fileSize: string;
  fileUrl: string | null;
  updatedAt: string;
}

export default function ResourcesManager() {
  const { showToast } = useToast();
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdminResource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/resources');
      const data = await res.json();
      setResources(data.resources ?? []);
    } catch {
      showToast('Could not load resources.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingResource(null);
    setIsModalOpen(true);
  }

  function openEdit(resource: AdminResource) {
    setEditingResource(resource);
    setIsModalOpen(true);
  }

  async function handleSave(values: ResourceFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingResource);
      const url = isEdit ? `/api/admin/resources/${editingResource!.id}` : '/api/admin/resources';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save resource.', 'error');
        return;
      }

      showToast(isEdit ? 'Resource updated.' : 'Resource created.', 'success');
      setIsModalOpen(false);
      setEditingResource(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(resource: AdminResource) {
    if (!confirm(`Delete "${resource.name}"? This can't be undone.`)) return;

    setDeletingId(resource.id);
    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete resource.', 'error');
        return;
      }
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
      showToast('Resource deleted.', 'success');
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
            Resources
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage downloadable catalogues, manuals, datasheets, and certificates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Resource
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading resources&hellip;</p>
      ) : resources.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Download className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No resources yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first resource
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <Badge variant="default">{resource.category}</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">{resource.fileType}</TableCell>
                <TableCell className="text-text-secondary text-xs">{resource.fileSize}</TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(resource.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(resource)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === resource.id}
                      onClick={() => handleDelete(resource)}
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

      <ResourceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialResource={editingResource}
      />
    </div>
  );
}