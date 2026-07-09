export interface Certification {
  code: string;
  name: string;
  category: 'ISO' | 'Compliance' | 'Accreditation';
  description: string;
}
