'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Newspaper, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import BlogFormModal, { type BlogFormValues } from './BlogFormModal';

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string[];
  images: string[];
  updatedAt: string;
}

export default function BlogManager() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      showToast('Could not load posts.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingPost(null);
    setIsModalOpen(true);
  }

  function openEdit(post: AdminBlogPost) {
    setEditingPost(post);
    setIsModalOpen(true);
  }

  async function handleSave(values: BlogFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingPost);
      const url = isEdit ? `/api/admin/blog/${editingPost!.id}` : '/api/admin/blog';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save post.', 'error');
        return;
      }

      showToast(isEdit ? 'Post updated.' : 'Post created.', 'success');
      setIsModalOpen(false);
      setEditingPost(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(post: AdminBlogPost) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;

    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete post.', 'error');
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      showToast('Post deleted.', 'success');
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
            Blog
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage articles shown on the public blog.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Post
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading posts&hellip;</p>
      ) : posts.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Newspaper className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No posts yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first post
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium">{post.title}</div>
                  <div className="text-text-secondary text-xs">/{post.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{post.category}</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">{post.date}</TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === post.id}
                      onClick={() => handleDelete(post)}
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

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialPost={editingPost}
      />
    </div>
  );
}