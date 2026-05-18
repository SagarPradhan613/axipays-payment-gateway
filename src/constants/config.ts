import type { CountryOption, Currency } from '@types';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://payment-assignment.onrender.com';

export const SECRET_KEY = import.meta.env.VITE_AXI_SECRET_KEY ?? 'AXI2026';

export const SUPPORTED_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'AED'];

export const SUPPORTED_COUNTRIES: CountryOption[] = [
  {
    code: 'US',
    value: 'United States',
    flag: '🇺🇸',
    labelKey: 'checkout:countries.unitedStates',
  },
  {
    code: 'IN',
    value: 'India',
    flag: '🇮🇳',
    labelKey: 'checkout:countries.india',
  },
  {
    code: 'GB',
    value: 'United Kingdom',
    flag: '🇬🇧',
    labelKey: 'checkout:countries.unitedKingdom',
  },
  {
    code: 'AE',
    value: 'United Arab Emirates',
    flag: '🇦🇪',
    labelKey: 'checkout:countries.unitedArabEmirates',
  },
  {
    code: 'DE',
    value: 'Germany',
    flag: '🇩🇪',
    labelKey: 'checkout:countries.germany',
  },
];

export const API_ENDPOINTS = {
  initiatePayment: '/initiate-payment',
  transactions: '/transactions',
} as const;
