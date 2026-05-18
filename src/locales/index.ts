import en from '@locales/en.json';
import hi from '@locales/hi.json';

export const resources = {
  en,
  hi,
} as const;

export type SupportedLocale = keyof typeof resources;

