'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, FolderKanban, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/ToastProvider';
import ProjectFormModal, { type ProjectFormValues } from './ProjectFormModal';

export interface AdminProject {
  id: string;
  slug: string;
  name: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  productSlugs: string[];
  images: string[];
  results: { id: string; metric: string; value: string }[];
  updatedAt: string;
}

export default function ProjectsManager() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      showToast('Could not load projects.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  function openCreate() {
    setEditingProject(null);
    setIsModalOpen(true);
  }

  function openEdit(project: AdminProject) {
    setEditingProject(project);
    setIsModalOpen(true);
  }

  async function handleSave(values: ProjectFormValues) {
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingProject);
      const url = isEdit ? `/api/admin/projects/${editingProject!.id}` : '/api/admin/projects';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? 'Could not save project.', 'error');
        return;
      }

      showToast(isEdit ? 'Project updated.' : 'Project created.', 'success');
      setIsModalOpen(false);
      setEditingProject(null);
      await load();
    } catch {
      showToast('Could not reach the server.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(project: AdminProject) {
    if (!confirm(`Delete "${project.name}"? This can't be undone.`)) return;

    setDeletingId(project.id);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Could not delete project.', 'error');
        return;
      }
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showToast('Project deleted.', 'success');
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
            Projects
          </h1>
          <p className="text-text-secondary max-w-xl text-sm">
            Manage case studies shown on the public site, including measurable results.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Project
          </Button>
        </div>
      </section>

      {isLoading ? (
        <p className="text-text-secondary py-12 text-center text-sm">Loading projects&hellip;</p>
      ) : projects.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <FolderKanban className="text-text-secondary h-8 w-8" />
          <p className="text-text-secondary text-sm">No projects yet.</p>
          <Button size="sm" onClick={openCreate} className="mt-2">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add your first project
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Results</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-text-secondary text-xs">/{project.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{project.industry}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="accent">{project.results.length} metrics</Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(project)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === project.id}
                      onClick={() => handleDelete(project)}
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

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        initialProject={editingProject}
      />
    </div>
  );
}