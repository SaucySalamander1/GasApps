import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

function buildHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Link
        href={buildHref(basePath, Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
        className={cn(
          'border-border hover:border-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors',
          currentPage === 1 && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="text-text-secondary px-2 text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(basePath, page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors',
              page === currentPage
                ? 'border-accent bg-accent text-white'
                : 'border-border hover:border-accent'
            )}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildHref(basePath, Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
        className={cn(
          'border-border hover:border-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors',
          currentPage === totalPages && 'pointer-events-none opacity-40'
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
