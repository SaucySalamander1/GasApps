export interface ProjectResult {
  metric: string;
  value: string;
}

export interface Project {
  slug: string;
  name: string;
  industry: string; // industry slug, cross-referenced with src/data/industries.ts
  summary: string;
  challenge: string;
  solution: string;
  results: ProjectResult[];
  productSlugs?: string[]; // cross-referenced with src/data/products.ts
  images?: string[];
}
