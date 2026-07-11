'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminCertification } from './CertificationsManager';

const CATEGORIES = ['ISO', 'Compliance', 'Accreditation'] as const;

export interface CertificationFormValues {
  code: string;
  name: string;
  category: string;
  description: string;
}

const EMPTY_FORM: CertificationFormValues = {
  code: '',
  name: '',
  category: CATEGORIES[0],
  description: '',
};

interface CertificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: CertificationFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialCertification: AdminCertification | null;
}

export default function CertificationFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialCertification,
}: CertificationFormModalProps) {
  const [form, setForm] = useState<CertificationFormValues>(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialCertification) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target certification changes
      setForm({
        code: initialCertification.code,
        name: initialCertification.name,
        category: initialCertification.category,
        description: initialCertification.description,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [isOpen, initialCertification]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.code.trim() || !form.name.trim() || !form.category.trim() || !form.description.trim()) {
      setError('Code, name, category, and description are required.');
      return;
    }

    onSave(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCertification ? 'Edit Certification' : 'New Certification'}
      className="max-w-lg"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialCertification ? 'Edit Certification' : 'New Certification'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Code</label>
            <Input
              value={form.code}
              onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="e.g. ISO-9001"
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
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Quality Management Systems"
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialCertification ? 'Save Changes' : 'Create Certification'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}