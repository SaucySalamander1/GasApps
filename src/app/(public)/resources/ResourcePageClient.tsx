'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import type { ResourceCategory } from '@/types/resource';
import { cn } from '@/utils/cn';

const categories: (ResourceCategory | 'All')[] = [
  'All',
  'Catalogues',
  'Brochures',
  'User Manuals',
  'Installation Guides',
  'Technical Datasheets',
  'Calibration Certificates',
  'ISO Certificates',
  'Company Documents',
];

export interface ResourcesPageClientResource {
  slug: string;
  name: string;
  category: string;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
}

interface ResourcesPageClientProps {
  resources: ResourcesPageClientResource[];
}

export function ResourcesPageClient({ resources }: ResourcesPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');

  const filtered =
    activeCategory === 'All' ? resources : resources.filter((r) => r.category === activeCategory);

  return (
    <>
      <PageHeader
        title="Resources"
        description="Catalogues, manuals, datasheets, and certificates in one place."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === category
                    ? 'border-accent bg-accent text-white'
                    : 'border-border text-text-secondary hover:border-accent'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-text-secondary mt-6 text-sm">
            {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) =>
              resource.fileUrl ? (
                <a
                  key={resource.slug}
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="border-border hover:border-accent flex items-center gap-3 rounded-lg border p-4 transition-colors"
                >
                  <div className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">
                      {resource.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {resource.category} · {resource.fileType} · {resource.fileSize}
                    </p>
                  </div>
                  <Download size={16} className="text-text-secondary shrink-0" />
                </a>
              ) : (
                <div
                  key={resource.slug}
                  aria-disabled="true"
                  title="File not available yet — contact us for a copy"
                  className="border-border flex cursor-not-allowed items-center gap-3 rounded-lg border p-4 opacity-50"
                >
                  <div className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">
                      {resource.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {resource.category} · {resource.fileType} · {resource.fileSize} · Coming
                      soon
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </section>
    </>
  );
}