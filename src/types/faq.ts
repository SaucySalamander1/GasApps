export type FaqCategory = 'General' | 'Products' | 'Ordering' | 'Shipping' | 'Support';

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}
