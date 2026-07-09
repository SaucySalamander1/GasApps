export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDownload {
  label: string;
  fileType: string; // e.g. 'PDF'
  fileSize: string; // e.g. '2.4 MB'
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  images?: string[]; // populated once real product photography exists
  specifications?: ProductSpec[];
  features?: string[];
  downloads?: ProductDownload[];
  industries?: string[]; // industry slugs this product commonly serves
  leadTime?: string;
  warranty?: string;
  certificationCodes?: string[]; // cross-referenced with src/data/certifications.ts
}

export type ProductCategory = 'Valves' | 'Instrumentation' | 'Fittings' | 'Regulators';
