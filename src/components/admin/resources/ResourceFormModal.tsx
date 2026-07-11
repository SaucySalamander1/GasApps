'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AdminResource } from './ResourcesManager';

const CATEGORIES = [
  'Catalogues',
  'Brochures',
  'User Manuals',
  'Installation Guides',
  'Technical Datasheets',
  'Calibration Certificates',
  'ISO Certificates',
  'Company Documents',
] as const;

export interface ResourceFormValues {
  name: string;
  category: string;
  fileType: string;
  fileSize: string;
}

const EMPTY_FORM: ResourceFormValues = {
  name: '',
  category: CATEGORIES[0],
  fileType: '',
  fileSize: '',
};

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ResourceFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialResource: AdminResource | null;
}

export default function ResourceFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialResource,
}: ResourceFormModalProps) {
  const [form, setForm] = useState<ResourceFormValues>(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialResource) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target resource changes
      setForm({
        name: initialResource.name,
        category: initialResource.category,
        fileType: initialResource.fileType,
        fileSize: initialResource.fileSize,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [isOpen, initialResource]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.fileType.trim() ||
      !form.fileSize.trim()
    ) {
      setError('Name, category, file type, and file size are required.');
      return;
    }

    onSave(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialResource ? 'Edit Resource' : 'New Resource'}
      className="max-w-lg"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialResource ? 'Edit Resource' : 'New Resource'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. 2026 Product Catalogue"
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            required
            className="border-border bg-surface text-text-primary h-10 w-full rounded-md border px-3 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">File Type</label>
            <Input
              value={form.fileType}
              onChange={(e) => setForm((prev) => ({ ...prev, fileType: e.target.value }))}
              placeholder="e.g. PDF"
              required
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">File Size</label>
            <Input
              value={form.fileSize}
              onChange={(e) => setForm((prev) => ({ ...prev, fileSize: e.target.value }))}
              placeholder="e.g. 2.4 MB"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialResource ? 'Save Changes' : 'Create Resource'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}