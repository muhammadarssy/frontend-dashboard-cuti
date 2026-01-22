import { format, parseISO, isValid } from 'date-fns';

// Lazy load locale to avoid issues with date-fns v4
let localeIdCache: any = null;

function getLocaleId() {
  if (localeIdCache !== null) return localeIdCache;
  try {
    // Try different import methods for date-fns v4
    const localeModule = require('date-fns/locale/id');
    localeIdCache = localeModule?.default || localeModule?.id || localeModule;
    return localeIdCache;
  } catch {
    localeIdCache = undefined;
    return undefined;
  }
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date, formatStr = 'dd MMM yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    const locale = getLocaleId();
    // Format with locale if available, otherwise format without locale
    return locale ? format(dateObj, formatStr, { locale }) : format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Format date to ISO string (YYYY-MM-DD) for date input
 */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Convert date string to ISO 8601 datetime for API
 * Converts YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function toISODateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

/**
 * Parse ISO date string to Date object
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Format number to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format number to Rupiah string (Rp. 10.000)
 */
export function formatRupiahInput(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Parse Rupiah formatted string to number
 * Removes "Rp", spaces, dots, and converts to number
 */
export function parseRupiahInput(value: string): number | undefined {
  if (!value || value.trim() === '') return undefined;
  // Remove "Rp", spaces, dots, commas, and any non-digit characters except minus at the start
  const cleaned = value
    .replace(/Rp\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  if (cleaned === '' || cleaned === '-') return undefined;
  // Only allow digits, optionally with minus at the start
  const numericOnly = cleaned.replace(/[^\d-]/g, '').replace(/-/g, (match, offset) => {
    return offset === 0 ? match : '';
  });
  if (numericOnly === '' || numericOnly === '-') return undefined;
  const parsed = parseInt(numericOnly, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Delay function for loading states
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
