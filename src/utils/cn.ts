import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class fragments the same way the app already thinks about Tailwind:
// build the list with clsx first, then let tailwind-merge resolve conflicting utilities.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
