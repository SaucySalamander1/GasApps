'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { AdminFaqItem } from './FaqManager';

const CATEGORIES = ['General', 'Products', 'Ordering', 'Shipping', 'Support'] as const;

export interface FaqFormValues {
  question: string;
  answer: string;
  category: string;
}

const EMPTY_FORM: FaqFormValues = {
  question: '',
  answer: '',
  category: CATEGORIES[0],
};

interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: FaqFormValues) => void | Promise<void>;
  isSaving: boolean;
  initialItem: AdminFaqItem | null;
}

export default function FaqFormModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialItem,
}: FaqFormModalProps) {
  const [form, setForm] = useState<FaqFormValues>(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional form reset/populate whenever the modal opens or the target item changes
      setForm({
        question: initialItem.question,
        answer: initialItem.answer,
        category: initialItem.category,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [isOpen, initialItem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.question.trim() || !form.answer.trim() || !form.category.trim()) {
      setError('Question, answer, and category are required.');
      return;
    }

    onSave(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Edit FAQ' : 'New FAQ'}
      className="max-w-lg"
    >
      <h2 className="font-display text-text-primary text-lg font-semibold">
        {initialItem ? 'Edit FAQ' : 'New FAQ'}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Question</label>
          <Input
            value={form.question}
            onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-text-primary mb-1.5 block text-sm font-medium">Answer</label>
          <Textarea
            value={form.answer}
            onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
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

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : initialItem ? 'Save Changes' : 'Create FAQ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}