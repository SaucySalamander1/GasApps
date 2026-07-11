'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminProduct } from './ProductsManager';

export interface ProductFormValues {
  name: string;
  category: string;
  description: string;
  leadTime: string;
  warranty: string;
  images: string[];
  industries: string[];
  certificationCodes: string[];
  features: string[];
  specifications: { label: string; value: string }[];
  downloads: { label: string; fileType: string; fileSize: string; fileUrl: string }[];
}

const EMPTY_FORM: ProductFormValues = {
  name: '',
  category: '',
  description: '',
  leadTime: '',
  warranty: '',
  images: [],
  industries: [],
  certificationCodes: [],
  features: [],
  specifications: [],
  downloads: [],
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ProductFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialProduct: AdminProduct | null;
}

/** Turns a comma-separated string into a clean array of trimmed, non-empty values. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialProduct,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [imagesInput, setImagesInput] = useState('');
  const [industriesInput, setIndustriesInput] = useState('');
  const [certsInput, setCertsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target product changes
      setForm({
        name: initialProduct.name,
        category: initialProduct.category,
        description: initialProduct.description,
        leadTime: initialProduct.leadTime ?? '',
        warranty: initialProduct.warranty ?? '',
        images: initialProduct.images,
        industries: initialProduct.industries,
        certificationCodes: initialProduct.certificationCodes,
        features: initialProduct.features,
        specifications: initialProduct.specifications.map((s) => ({
          label: s.label,
          value: s.value,
        })),
        downloads: initialProduct.downloads.map((d) => ({
          label: d.label,
          fileType: d.fileType,
          fileSize: d.fileSize,
          fileUrl: d.fileUrl ?? '',
        })),
      });
      setImagesInput(initialProduct.images.join(', '));
      setIndustriesInput(initialProduct.industries.join(', '));
      setCertsInput(initialProduct.certificationCodes.join(', '));
      setFeaturesInput(initialProduct.features.join(', '));
    } else {
      setForm(EMPTY_FORM);
      setImagesInput('');
      setIndustriesInput('');
      setCertsInput('');
      setFeaturesInput('');
    }
    setError('');
  }, [isOpen, initialProduct]);

  function updateSpec(index: number, key: 'label' | 'value', value: string) {
    setForm((prev) => {
      const next = [...prev.specifications];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, specifications: next };
    });
  }

  function updateDownload(index: number, key: 'label' | 'fileType' | 'fileSize' | 'fileUrl', value: string) {
    setForm((prev) => {
      const next = [...prev.downloads];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, downloads: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.category.trim() || !form.description.trim()) {
      setError('Name, category, and description are required.');
      return;
    }

    onSave({
      ...form,
      images: toList(imagesInput),
      industries: toList(industriesInput),
      certificationCodes: toList(certsInput),
      features: toList(featuresInput),
      specifications: form.specifications.filter((s) => s.label.trim()),
      downloads: form.downloads.filter((d) => d.label.trim()),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Edit Product' : 'New Product'}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialProduct ? 'Edit Product' : 'New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Category</label>
            <Input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Lead Time <span className="text-text-secondary">(optional)</span>
            </label>
            <Input
              value={form.leadTime}
              onChange={(e) => setForm((prev) => ({ ...prev, leadTime: e.target.value }))}
              placeholder="e.g. 2-3 weeks"
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Warranty <span className="text-text-secondary">(optional)</span>
            </label>
            <Input
              value={form.warranty}
              onChange={(e) => setForm((prev) => ({ ...prev, warranty: e.target.value }))}
              placeholder="e.g. 2 years"
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Image URLs <span className="text-text-secondary">(comma-separated)</span>
          </label>
          <Textarea
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            placeholder="https://.../1.jpg, https://.../2.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Industries <span className="text-text-secondary">(comma-separated)</span>
            </label>
            <Input
              value={industriesInput}
              onChange={(e) => setIndustriesInput(e.target.value)}
              placeholder="Oil & Gas, Manufacturing"
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Certification Codes <span className="text-text-secondary">(comma-separated)</span>
            </label>
            <Input
              value={certsInput}
              onChange={(e) => setCertsInput(e.target.value)}
              placeholder="ISO-9001, API-6D"
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Features <span className="text-text-secondary">(comma-separated)</span>
          </label>
          <Input
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Corrosion resistant, Low maintenance"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-text-primary block text-sm font-medium">Specifications</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  specifications: [...prev.specifications, { label: '', value: '' }],
                }))
              }
            >
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {form.specifications.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label (e.g. Diameter)"
                  value={spec.label}
                  onChange={(e) => updateSpec(i, 'label', e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 2 inch)"
                  value={spec.value}
                  onChange={(e) => updateSpec(i, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      specifications: prev.specifications.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-text-primary block text-sm font-medium">Downloads</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  downloads: [...prev.downloads, { label: '', fileType: '', fileSize: '', fileUrl: '' }],
                }))
              }
            >
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {form.downloads.map((dl, i) => (
              <div key={i} className="border-border flex flex-col gap-2 rounded-md border p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Label (e.g. Datasheet)"
                    value={dl.label}
                    onChange={(e) => updateDownload(i, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="Type (e.g. PDF)"
                    value={dl.fileType}
                    onChange={(e) => updateDownload(i, 'fileType', e.target.value)}
                    className="max-w-24"
                  />
                  <Input
                    placeholder="Size (e.g. 1.2 MB)"
                    value={dl.fileSize}
                    onChange={(e) => updateDownload(i, 'fileSize', e.target.value)}
                    className="max-w-28"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        downloads: prev.downloads.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  placeholder="File URL (optional — leave blank to disable the link)"
                  value={dl.fileUrl}
                  onChange={(e) => updateDownload(i, 'fileUrl', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialProduct ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}