export type ResourceCategory =
  | 'Catalogues'
  | 'Brochures'
  | 'User Manuals'
  | 'Installation Guides'
  | 'Technical Datasheets'
  | 'Calibration Certificates'
  | 'ISO Certificates'
  | 'Company Documents';

export interface Resource {
  slug: string;
  name: string;
  category: ResourceCategory;
  fileType: string;
  fileSize: string;
  fileUrl?: string; // link to the actual file, once uploaded — omit if not available yet
}