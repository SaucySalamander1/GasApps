'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminBlogPost } from './BlogManager';

export interface BlogFormValues {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  images: string[];
  content: string[];
}

const EMPTY_FORM: BlogFormValues = {
  title: '',
  category: '',
  date: '',
  excerpt: '',
  images: [],
  content: [],
};

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: BlogFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialPost: AdminBlogPost | null;
}

/** Turns a comma-separated string into a clean array of trimmed, non-empty values. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function BlogFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialPost,
}: BlogFormModalProps) {
  const [form, setForm] = useState<BlogFormValues>(EMPTY_FORM);
  const [imagesInput, setImagesInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialPost) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target post changes
      setForm({
        title: initialPost.title,
        category: initialPost.category,
        date: initialPost.date,
        excerpt: initialPost.excerpt,
        images: initialPost.images,
        content: initialPost.content,
      });
      setImagesInput(initialPost.images.join(', '));
    } else {
      setForm(EMPTY_FORM);
      setImagesInput('');
    }
    setError('');
  }, [isOpen, initialPost]);

  function updateParagraph(index: number, value: string) {
    setForm((prev) => {
      const next = [...prev.content];
      next[index] = value;
      return { ...prev, content: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.date.trim() ||
      !form.excerpt.trim()
    ) {
      setError('Title, category, date, and excerpt are required.');
      return;
    }

    onSave({
      ...form,
      images: toList(imagesInput),
      content: form.content.map((p) => p.trim()).filter(Boolean),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPost ? 'Edit Post' : 'New Post'}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialPost ? 'Edit Post' : 'New Post'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Category</label>
            <Input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. Engineering, Safety, Company News"
              required
            />
          </div>
          <div>
            <label className="text-text-primary mb-1.5 block text-sm font-medium">Date</label>
            <Input
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              placeholder="e.g. June 2026"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">
            Excerpt <span className="text-text-secondary">(short summary shown in listings)</span>
          </label>
          <Textarea
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-text-primary block text-sm font-medium">
              Article Content <span className="text-text-secondary">(one box per paragraph)</span>
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setForm((prev) => ({ ...prev, content: [...prev.content, ''] }))}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Paragraph
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {form.content.map((paragraph, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-text-secondary flex h-10 w-6 shrink-0 items-center justify-center text-sm">
                  {i + 1}
                </span>
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  placeholder="Paragraph text..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      content: prev.content.filter((_, idx) => idx !== i),
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
            {isSaving ? 'Saving...' : initialPost ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}