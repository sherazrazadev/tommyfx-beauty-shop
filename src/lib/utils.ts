import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Add this to src/lib/utils.ts or create it if it doesn't exist

export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toFixed(2)}`;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
