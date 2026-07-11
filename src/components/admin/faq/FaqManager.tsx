'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, HelpCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import FaqFormModal, { type FaqFormValues } from './FaqFormModal';

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  updatedAt: string;
}

export default function FaqManager() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminFaqItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/faq');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      showToast('Could not load FAQs.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEdit(item: AdminFaqItem) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  async function handleSave(values: FaqFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingItem);
      const url = isEdit ? `/api/admin/faq/${editingItem!.id}` : '/api/admin/faq';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save FAQ.', 'error');
        return;
      }

      showToast(isEdit ? 'FAQ updated.' : 'FAQ created.', 'success');
      setIsModalOpen(false);
      setEditingItem(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: AdminFaqItem) {
    if (!confirm(`Delete this FAQ? This can't be undone.`)) return;

    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/admin/faq/${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete FAQ.', 'error');
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast('FAQ deleted.', 'success');
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
            FAQs
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage the questions and answers shown on the public FAQ page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New FAQ
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading FAQs&hellip;</p>
      ) : items.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <HelpCircle className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No FAQs yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first FAQ
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-[320px] truncate font-medium">
                  {item.question}
                </TableCell>
                <TableCell>
                  <Badge variant="default">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item)}
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

      <FaqFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialItem={editingItem}
      />
    </div>
  );
}