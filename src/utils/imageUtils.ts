/**
 * CampusSoko Image Utilities
 * Provides safe fallback and validation to ensure no empty string ("") is ever passed to an img src attribute.
 */

export const DEFAULT_LISTING_IMAGE =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_AVATAR_BASE = 'https://api.dicebear.com/7.x/initials/svg';

export function isValidImageSrc(src?: string | null): src is string {
  return typeof src === 'string' && src.trim().length > 0;
}

export function getSafeAvatarUrl(avatarUrl?: string | null, nameFallback: string = 'User'): string {
  if (isValidImageSrc(avatarUrl)) {
    return avatarUrl.trim();
  }
  const cleanSeed = encodeURIComponent(nameFallback.trim() || 'User');
  return `${DEFAULT_AVATAR_BASE}?seed=${cleanSeed}&backgroundColor=b6e3f4`;
}

export function getSafeListingImageUrl(imageUrl?: string | null): string {
  if (isValidImageSrc(imageUrl)) {
    return imageUrl.trim();
  }
  return DEFAULT_LISTING_IMAGE;
}
