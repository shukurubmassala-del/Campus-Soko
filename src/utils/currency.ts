/**
 * Formats numbers into standardized Tanzanian Shilling currency strings.
 * Example: 35000 -> "TZS 35,000"
 */
export function formatTZS(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'TZS 0';
  }
  return `TZS ${Math.round(amount).toLocaleString('en-US')}`;
}

export function parseTZS(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const digits = value.replace(/[^\d]/g, '');
  return parseInt(digits, 10) || 0;
}
