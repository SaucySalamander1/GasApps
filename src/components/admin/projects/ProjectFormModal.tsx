'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminProject } from './ProjectsManager';

interface IndustryOption {
  slug: string;
  name: string;
}

export interface ProjectFormValues {
  name: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  images: string[];
  productSlugs: string[];
  results: { metric: string; value: string }[];
}

const EMPTY_FORM: ProjectFormValues = {
  name: '',
  industry: '',
  summary: '',
  challenge: '',
  solution: '',
  images: [],
  productSlugs: [],
  results: [],
};

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ProjectFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialProject: AdminProject | null;
}

/** Turns a comma-separated string into a clean array of trimmed, non-empty values. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialProject,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectFormValues>(EMPTY_FORM);
  const [imagesInput, setImagesInput] = useState('');
  const [productSlugsInput, setProductSlugsInput] = useState('');
  const [error, setError] = useState('');
  const [industryOptions, setIndustryOptions] = useState<IndustryOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Populates the industry dropdown whenever the modal opens.
    fetch('/api/admin/industries')
      .then((res) => res.json())
      .then((data) => setIndustryOptions(data.industries ?? []))
      .catch(() => setIndustryOptions([]));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialProject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target project changes
      setForm({
        name: initialProject.name,
        industry: initialProject.industry,
        summary: initialProject.summary,
        challenge: initialProject.challenge,
        solution: initialProject.solution,
        images: initialProject.images,
        productSlugs: initialProject.productSlugs,
        results: initialProject.results.map((r) => ({ metric: r.metric, value: r.value })),
      });
      setImagesInput(initialProject.images.join(', '));
      setProductSlugsInput(initialProject.productSlugs.join(', '));
    } else {
      setForm(EMPTY_FORM);
      setImagesInput('');
      setProductSlugsInput('');
    }
    setError('');
  }, [isOpen, initialProject]);

  function updateResult(index: number, key: 'metric' | 'value', value: string) {
    setForm((prev) => {
      const next = [...prev.results];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, results: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (
      !form.name.trim() ||
      !form.industry.trim() ||
      !form.summary.trim() ||
      !form.challenge.trim() ||
      !form.solution.trim()
    ) {
      setError('Name, industry, summary, challenge, and solution are required.');
      return;
    }

    onSave({
      ...form,
      images: toList(imagesInput),
      productSlugs: toList(productSlugsInput),
      results: form.results.filter((r) => r.metric.trim()),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProject ? 'Edit Project' : 'New Project'}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialProject ? 'Edit Project' : 'New Project'}
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
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Industry</label>
            <select
              value={form.industry}
              onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
              required
              className="border-border bg-surface text-text-primary h-10 w-full rounded-md border px-3 text-sm"
            >
              <option value="" disabled>
                Select an industry&hellip;
              </option>
              {industryOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>
            {industryOptions.length === 0 && (
              <p className="text-text-secondary mt-1 text-xs">
                No industries yet &mdash; create one in the Industries section first.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Summary</label>
          <Input
            value={form.summary}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Challenge</label>
          <Textarea
            value={form.challenge}
            onChange={(e) => setForm((prev) => ({ ...prev, challenge: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Solution</label>
          <Textarea
            value={form.solution}
            onChange={(e) => setForm((prev) => ({ ...prev, solution: e.target.value }))}
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
            Related Product Slugs <span className="text-text-secondary">(comma-separated)</span>
          </label>
          <Input
            value={productSlugsInput}
            onChange={(e) => setProductSlugsInput(e.target.value)}
            placeholder="ball-valve-2, gasket-set-a"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-text-primary block text-sm font-medium">Results</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  results: [...prev.results, { metric: '', value: '' }],
                }))
              }
            >
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {form.results.map((result, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Metric (e.g. Downtime reduced)"
                  value={result.metric}
                  onChange={(e) => updateResult(i, 'metric', e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 40%)"
                  value={result.value}
                  onChange={(e) => updateResult(i, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      results: prev.results.filter((_, idx) => idx !== i),
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
            {isSaving ? 'Saving...' : initialProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}