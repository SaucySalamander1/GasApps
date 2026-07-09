export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  features: string[];
  process?: ServiceProcessStep[];
  images?: string[];
  duration?: string;
  coverageArea?: string;
  certificationCodes?: string[];
}
