import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numerical amount into Indian Rupee (INR - ₹) representation
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}
