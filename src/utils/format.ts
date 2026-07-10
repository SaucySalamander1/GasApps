/** Converts a display name into a URL-safe slug, e.g. `Ball Valve - 2"` -> `ball-valve-2`. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}