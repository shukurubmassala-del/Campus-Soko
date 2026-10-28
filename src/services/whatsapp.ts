import { Language, Listing } from '../types';

/**
 * Normalizes Tanzanian local numbers to international format (255...)
 * Examples:
 *   "0712 345 678" -> "255712345678"
 *   "+255 789 123 456" -> "255789123456"
 *   "255754123456" -> "255754123456"
 */
export function formatTanzanianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '255' + digits.slice(1);
  }
  if (digits.startsWith('255')) {
    return digits;
  }
  return '255' + digits;
}

/**
 * Generates a pre-filled WhatsApp click-to-chat URL with campus context
 */
export function generateWhatsAppUrl(
  phone: string,
  listing: Pick<Listing, 'title' | 'price' | 'campusZone' | 'safePickupPoint'>,
  buyerName: string,
  lang: Language
): string {
  const internationalNumber = formatTanzanianPhone(phone);
  const formattedPrice = `TZS ${listing.price.toLocaleString('en-US')}`;

  let message = '';
  if (lang === 'sw') {
    message = `Habari! Naitwa ${buyerName || 'Mwanafunzi'}, nimeona tangazo lako kwenye CampusSoko la "${listing.title}" kwa ${formattedPrice}. Je bado kipo? Tunaweza kukutana ${listing.safePickupPoint || listing.campusZone}?`;
  } else {
    message = `Hello! My name is ${buyerName || 'Student'}, I found your listing on CampusSoko for "${listing.title}" priced at ${formattedPrice}. Is it still available? Can we meet at ${listing.safePickupPoint || listing.campusZone}?`;
  }

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
