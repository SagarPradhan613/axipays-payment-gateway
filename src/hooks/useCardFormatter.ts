import type { CardType } from '@types';
import { formatCardDisplay, formatMaskedCardForDisplay } from '@utils';

/**
 * Detects a payment card network from the leading digits.
 */
const detectCardType = (rawValue: string): CardType => {
  if (/^4/.test(rawValue)) {
    return 'visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(rawValue)) {
    return 'mastercard';
  }

  if (/^3[47]/.test(rawValue)) {
    return 'amex';
  }

  return 'unknown';
};

/**
 * Normalizes card input into a raw numeric value, a formatted display value,
 * and a detected card type for UI rendering.
 */
export const useCardFormatter = (value: string) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 19);
  const formattedValue = formatCardDisplay(rawValue);
  const maskedDisplayValue = formatMaskedCardForDisplay(rawValue);
  const cardType = detectCardType(rawValue);

  return {
    cardType,
    formattedValue,
    maskedDisplayValue,
    rawValue,
  };
};
