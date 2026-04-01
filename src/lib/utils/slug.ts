/**
 * Normalize slug to ensure consistency
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 * Removes leading/trailing hyphens and multiple consecutive hyphens
 */
export function normalizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens, underscores, and spaces
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate slug from title if no slug provided
 */
export function generateSlug(title?: string): string {
  if (!title) return '';
  return normalizeSlug(title);
}
