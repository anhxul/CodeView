import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicts intelligently.
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a Tailwind text color class based on a 0-100 score.
 */
export function scoreColor(score) {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

/**
 * Returns a Tailwind color class based on issue severity.
 */
export function severityColor(severity) {
  const map = {
    critical: 'text-destructive border-destructive/30 bg-destructive/10',
    high: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    medium: 'text-warning border-warning/30 bg-warning/10',
    low: 'text-success border-success/30 bg-success/10',
    info: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  };
  return map[severity] || map.info;
}

/**
 * Formats a date string into a human-readable relative or short format.
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}