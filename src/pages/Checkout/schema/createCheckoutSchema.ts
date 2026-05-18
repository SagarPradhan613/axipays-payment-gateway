import type { TFunction } from 'i18next';
import { z } from 'zod';
import { validateLuhn } from '@utils';

const currentYear = new Date().getFullYear();

/**
 * Builds the localized Zod schema used by the checkout form.
 */
export const createCheckoutSchema = (t: TFunction) =>
  z.object({
    cardHolderName: z
      .string()
      .trim()
      .min(3, t('checkout:validation.cardHolderNameMin')),
    email: z.string().trim().email(t('checkout:validation.emailInvalid')),
    cardNumber: z
      .string()
      .trim()
      .min(12, t('checkout:validation.cardNumberRequired'))
      .refine((value) => validateLuhn(value), t('checkout:validation.cardNumberInvalid')),
    expiryMonth: z
      .string()
      .regex(/^(0[1-9]|1[0-2])$/, t('checkout:validation.expiryMonthInvalid')),
    expiryYear: z
      .string()
      .regex(/^\d{4}$/, t('checkout:validation.expiryYearInvalid'))
      .refine((value) => Number(value) >= currentYear, t('checkout:validation.expiryYearPast')),
    cvv: z.string().regex(/^\d{3,4}$/, t('checkout:validation.cvvInvalid')),
    amount: z
      .string()
      .trim()
      .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), t('checkout:validation.amountFormat'))
      .refine((value) => Number(value) > 0, t('checkout:validation.amountPositive')),
    currency: z.enum(['USD', 'EUR', 'GBP', 'AED', 'INR']),
    country: z.string().trim().min(1, t('checkout:validation.countryRequired')),
    address: z
      .string()
      .trim()
      .min(8, t('checkout:validation.addressRequired')),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[1-9]\d{7,14}$/, t('checkout:validation.phoneInvalid')),
  });

