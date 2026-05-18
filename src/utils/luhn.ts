// Luhn runs client-side so we can reject obviously bad card numbers before we burn an API call
// or show the user a backend failure that never needed to happen.
export const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');

  if (digits.length < 12) {
    return false;
  }

  let checksum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    checksum += digit;
    shouldDouble = !shouldDouble;
  }

  return checksum % 10 === 0;
};

export const isValidCardNumber = validateLuhn;
