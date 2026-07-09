'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Download as DownloadIcon, Search as SearchIcon } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { getAllDownloads } from '@/data/downloads';

export default function DownloadsPage() {
  const [query, setQuery] = useState('');
  const allDownloads = useMemo(() => getAllDownloads(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allDownloads;
    const q = query.toLowerCase();
    return allDownloads.filter(
      (item) => item.name.toLowerCase().includes(q) || item.source.toLowerCase().includes(q)
    );
  }, [allDownloads, query]);

  return (
    <>
      <PageHeader
        title="Download Center"
        description="Search across every datasheet, manual, and document in one place."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <div className="relative mx-auto max-w-xl">
            <SearchIcon
              size={18}
              className="text-text-secondary absolute top-1/2 left-4 -translate-y-1/2"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by document or product name..."
              className="h-12 pl-11 text-base"
            />
          </div>

          <p className="text-text-secondary mt-6 text-sm">
            {filtered.length} {filtered.length === 1 ? 'file' : 'files'} found
          </p>

          {filtered.length === 0 ? (
            <div className="border-border mt-6 rounded-lg border py-16 text-center">
              <p className="text-text-secondary">No files match your search.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <a
                  key={item.slug}
                  href="#"
                  className="border-border hover:border-accent flex items-center gap-3 rounded-lg border p-4 transition-colors"
                >
                  <div className="bg-accent/10 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">{item.name}</p>
                    <p className="text-text-secondary text-xs">
                      {item.source} · {item.fileType} · {item.fileSize}
                    </p>
                  </div>
                  <DownloadIcon size={16} className="text-text-secondary shrink-0" />
                </a>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
