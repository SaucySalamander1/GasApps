'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Package, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import ProductFormModal, { type ProductFormValues } from './ProductFormModal';

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  industries: string[];
  leadTime: string | null;
  warranty: string | null;
  certificationCodes: string[];
  features: string[];
  specifications: { id: string; label: string; value: string }[];
  downloads: { id: string; label: string; fileType: string; fileSize: string; fileUrl: string | null }[];
  updatedAt: string;
}

export default function ProductsManager() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      showToast('Could not load products.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  async function handleSave(values: ProductFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingProduct);
      const url = isEdit ? `/api/admin/products/${editingProduct!.id}` : '/api/admin/products';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save product.', 'error');
        return;
      }

      showToast(isEdit ? 'Product updated.' : 'Product created.', 'success');
      setIsModalOpen(false);
      setEditingProduct(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: AdminProduct) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    setDeletingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete product.', 'error');
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Product deleted.', 'success');
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
            Products
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage the catalog shown on the public site &mdash; specs, downloads, and imagery
            included.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Product
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading products&hellip;</p>
      ) : products.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Package className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No products yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first product
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Industries</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-text-secondary text-xs">/{product.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{product.category}</Badge>
                </TableCell>
                <TableCell className="max-w-[220px]">
                  <div className="flex flex-wrap gap-1">
                    {product.industries.length > 0 ? (
                      product.industries.slice(0, 3).map((industry) => (
                        <Badge key={industry} variant="accent">
                          {industry}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-text-secondary text-xs">&mdash;</span>
                    )}
                    {product.industries.length > 3 && (
                      <span className="text-text-secondary text-xs">
                        +{product.industries.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {product.specifications.length}
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product)}
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

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialProduct={editingProduct}
      />
    </div>
  );
}