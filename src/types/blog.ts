export type BlogCategory = 'Engineering' | 'Safety' | 'Maintenance' | 'Company News';

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  date: string;
  excerpt: string;
  content: string[]; // array of paragraphs
  images?: string[];
}
