export interface DownloadItem {
  slug: string;
  name: string;
  source: string; // e.g. product name or "Resources"
  sourceHref: string; // link back to the product page or '#' for general resources
  fileType: string;
  fileSize: string;
  fileUrl?: string; // link to the actual file, once uploaded — omit if not available yet
}