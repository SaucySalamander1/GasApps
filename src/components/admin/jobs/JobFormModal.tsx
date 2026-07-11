'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AdminJob } from './JobsManager';

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;

export interface JobFormValues {
  title: string;
  department: string;
  location: string;
  type: string;
}

const EMPTY_FORM: JobFormValues = {
  title: '',
  department: '',
  location: '',
  type: TYPES[0],
};

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: JobFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialJob: AdminJob | null;
}

export default function JobFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialJob,
}: JobFormModalProps) {
  const [form, setForm] = useState<JobFormValues>(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialJob) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target job changes
      setForm({
        title: initialJob.title,
        department: initialJob.department,
        location: initialJob.location,
        type: initialJob.type,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [isOpen, initialJob]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.department.trim() || !form.location.trim() || !form.type.trim()) {
      setError('Title, department, location, and type are required.');
      return;
    }

    onSave(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialJob ? 'Edit Job Posting' : 'New Job Posting'}
      className="max-w-lg"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialJob ? 'Edit Job Posting' : 'New Job Posting'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Mechanical Engineer"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Department</label>
            <Input
              value={form.department}
              onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              placeholder="e.g. Engineering"
              required
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Location</label>
            <Input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Dhaka, Bangladesh"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            required
            className="border-border bg-surface text-text-primary h-10 w-full rounded-md border px-3 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialJob ? 'Save Changes' : 'Create Posting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}