// This is the canonical card mask for the app: first six for identification, last four for
// confirmation, and nothing useful in the middle for anyone looking over a shoulder.
export const maskCardNumber = (card: string): string => {
  const digits = card.replace(/\D/g, '');

  if (digits.length <= 4) {
    return digits;
  }

  const firstSix = digits.slice(0, 6);
  const lastFour = digits.slice(-4);
  const middleMask = '*'.repeat(Math.max(digits.length - 10, 0)).padEnd(6, '*');

  return `${firstSix} ${middleMask} ${lastFour}`.trim();
};

// CVV is never meant to be recoverable from the UI, so every rendered state collapses to the
// same fixed mask instead of trying to mirror length.
export const maskCVV = (): string => '***';

// Raw card digits are stored without spacing; this helper only shapes them for editing flows
// that still need the full number available under the hood.
export const formatCardDisplay = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();

// The checkout input shows this masked representation so the real card number never sits on the
// screen in plain text, even while the field is still being edited.
export const formatMaskedCardForDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 19);

  if (!digits) {
    return '';
  }

  const maskedCharacters = digits.split('').map((digit, index) => {
    const shouldRevealLeading = index < 6;
    const shouldRevealTrailing = digits.length > 10 && index >= digits.length - 4;

    return shouldRevealLeading || shouldRevealTrailing ? digit : '*';
  });

  return maskedCharacters.reduce((formatted, character, index) => {
    const nextValue = `${formatted}${character}`;
    return (index + 1) % 4 === 0 && index < maskedCharacters.length - 1 ? `${nextValue} ` : nextValue;
  }, '');
};

// Expiry input is normalized as the user types so downstream validation can work with a
// predictable MM/YYYY shape instead of every possible separator they might enter.
export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 6);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
