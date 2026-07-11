'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminIndustry } from './IndustriesManager';

export interface IndustryFormValues {
  name: string;
  summary: string;
  description: string;
  images: string[];
  applications: string[];
}

const EMPTY_FORM: IndustryFormValues = {
  name: '',
  summary: '',
  description: '',
  images: [],
  applications: [],
};

interface IndustryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: IndustryFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialIndustry: AdminIndustry | null;
}

/** Turns a comma-separated string into a clean array of trimmed, non-empty values. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function IndustryFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialIndustry,
}: IndustryFormModalProps) {
  const [form, setForm] = useState<IndustryFormValues>(EMPTY_FORM);
  const [imagesInput, setImagesInput] = useState('');
  const [applicationsInput, setApplicationsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialIndustry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target industry changes
      setForm({
        name: initialIndustry.name,
        summary: initialIndustry.summary,
        description: initialIndustry.description,
        images: initialIndustry.images,
        applications: initialIndustry.applications,
      });
      setImagesInput(initialIndustry.images.join(', '));
      setApplicationsInput(initialIndustry.applications.join(', '));
    } else {
      setForm(EMPTY_FORM);
      setImagesInput('');
      setApplicationsInput('');
    }
    setError('');
  }, [isOpen, initialIndustry]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.summary.trim() || !form.description.trim()) {
      setError('Name, summary, and description are required.');
      return;
    }

    onSave({
      ...form,
      images: toList(imagesInput),
      applications: toList(applicationsInput),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialIndustry ? 'Edit Industry' : 'New Industry'}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialIndustry ? 'Edit Industry' : 'New Industry'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Summary <span className="text-text-secondary">(short, shown in listings)</span>
          </label>
          <Input
            value={form.summary}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Full Description
          </label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
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

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Applications <span className="text-text-secondary">(comma-separated)</span>
          </label>
          <Textarea
            value={applicationsInput}
            onChange={(e) => setApplicationsInput(e.target.value)}
            placeholder="Pipeline fittings, Refinery valves"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialIndustry ? 'Save Changes' : 'Create Industry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}