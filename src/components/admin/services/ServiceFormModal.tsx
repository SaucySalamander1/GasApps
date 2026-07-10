'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminService } from './ServicesManager';

export interface ServiceFormValues {
  name: string;
  summary: string;
  description: string;
  duration: string;
  coverageArea: string;
  images: string[];
  features: string[];
  certificationCodes: string[];
  process: { title: string; description: string }[];
}

const EMPTY_FORM: ServiceFormValues = {
  name: '',
  summary: '',
  description: '',
  duration: '',
  coverageArea: '',
  images: [],
  features: [],
  certificationCodes: [],
  process: [],
};

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ServiceFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialService: AdminService | null;
}

/** Turns a comma-separated string into a clean array of trimmed, non-empty values. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ServiceFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialService,
}: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceFormValues>(EMPTY_FORM);
  const [imagesInput, setImagesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [certsInput, setCertsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialService) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target service changes
      setForm({
        name: initialService.name,
        summary: initialService.summary,
        description: initialService.description,
        duration: initialService.duration ?? '',
        coverageArea: initialService.coverageArea ?? '',
        images: initialService.images,
        features: initialService.features,
        certificationCodes: initialService.certificationCodes,
        process: initialService.process
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ title: s.title, description: s.description })),
      });
      setImagesInput(initialService.images.join(', '));
      setFeaturesInput(initialService.features.join(', '));
      setCertsInput(initialService.certificationCodes.join(', '));
    } else {
      setForm(EMPTY_FORM);
      setImagesInput('');
      setFeaturesInput('');
      setCertsInput('');
    }
    setError('');
  }, [isOpen, initialService]);

  function updateStep(index: number, key: 'title' | 'description', value: string) {
    setForm((prev) => {
      const next = [...prev.process];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, process: next };
    });
  }

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
      features: toList(featuresInput),
      certificationCodes: toList(certsInput),
      process: form.process.filter((s) => s.title.trim()),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialService ? 'Edit Service' : 'New Service'}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialService ? 'Edit Service' : 'New Service'}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Duration <span className="text-text-secondary">(optional)</span>
            </label>
            <Input
              value={form.duration}
              onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g. 1-2 days"
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">
              Coverage Area <span className="text-text-secondary">(optional)</span>
            </label>
            <Input
              value={form.coverageArea}
              onChange={(e) => setForm((prev) => ({ ...prev, coverageArea: e.target.value }))}
              placeholder="e.g. Dhaka & Chattogram"
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
              Features <span className="text-text-secondary">(comma-separated)</span>
            </label>
            <Input
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="24/7 support, On-site technicians"
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-text-primary block text-sm font-medium">Process Steps</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  process: [...prev.process, { title: '', description: '' }],
                }))
              }
            >
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {form.process.map((step, i) => (
              <div key={i} className="border-border flex gap-2 rounded-md border p-2">
                <span className="text-text-secondary flex h-10 w-6 shrink-0 items-center justify-center text-sm">
                  {i + 1}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <Input
                    placeholder="Step title (e.g. Site Assessment)"
                    value={step.title}
                    onChange={(e) => updateStep(i, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(i, 'description', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      process: prev.process.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
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
            {isSaving ? 'Saving...' : initialService ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}