import type { DownloadItem } from '@/types/download';
import { products } from '@/data/products';
import { resources } from '@/data/resources';

// Combines every product's downloads with the general Resources library into one
// unified, searchable list. Single source of truth stays in products.ts / resources.ts —
// this file only reshapes and merges, it doesn't duplicate data.
export function getAllDownloads(): DownloadItem[] {
  const productDownloads: DownloadItem[] = products.flatMap((product) =>
    (product.downloads ?? []).map((file) => ({
      slug: `${product.slug}-${file.label.toLowerCase().replace(/\s+/g, '-')}`,
      name: file.label,
      source: product.name,
      sourceHref: `/products/${product.slug}`,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileUrl: file.fileUrl,
    }))
  );

  const resourceDownloads: DownloadItem[] = resources.map((resource) => ({
    slug: resource.slug,
    name: resource.name,
    source: resource.category,
    sourceHref: '/resources',
    fileType: resource.fileType,
    fileSize: resource.fileSize,
    fileUrl: resource.fileUrl,
  }));

  return [...productDownloads, ...resourceDownloads];
}