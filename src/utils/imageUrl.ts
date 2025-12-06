/**
 * Image URL Utilities
 * Helpers for constructing full image URLs
 */

const API_BASE_URL = import.meta.env.DEV 
  ? '' // In dev, use relative paths (proxy handles it)
  : (import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000');

/**
 * Get full avatar URL
 */
export function getAvatarUrl(avatarPath: string | null | undefined): string {
  if (!avatarPath) {
    return 'https://via.placeholder.com/150?text=Avatar';
  }

  // If already a full URL, return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }

  // If relative path, prepend the base URL
  if (avatarPath.startsWith('/')) {
    return `${API_BASE_URL}${avatarPath}`;
  }

  // Otherwise prepend uploads path
  return `${API_BASE_URL}/uploads/${avatarPath}`;
}

/**
 * Get full image URL
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://via.placeholder.com/300?text=Image';
  }

  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If relative path, prepend the base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise prepend uploads path
  return `${API_BASE_URL}/uploads/${imagePath}`;
}
