import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Add this to src/lib/utils.ts or create it if it doesn't exist

// Update formatCurrency function in utils.ts
export const formatCurrency = (amount: number): string => {
  return `Rs. ${Math.round(amount)}`; // Remove decimals for rupees
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
