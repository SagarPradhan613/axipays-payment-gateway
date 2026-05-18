import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import { SECRET_KEY } from '@constants';

// The gateway expects an exact signature recipe, so this helper does the full transformation
// in one place and returns the ready-to-send uppercase digest for the Hash header.
export const generateHmacHash = (cardNumber: string, email: string): string => {
  const sanitizedCard = cardNumber.replace(/\D/g, '');
  const firstSix = sanitizedCard.slice(0, 6);
  const lastFour = sanitizedCard.slice(-4);
  const combined = `${firstSix}${lastFour}`;
  const reversedCardFragment = combined.split('').reverse().join('');
  const reversedEmail = email.trim().split('').reverse().join('');
  const message = `${reversedEmail}AXIPAYS${reversedCardFragment}`.toUpperCase();

  return HmacSHA256(message, SECRET_KEY).toString(Hex).toUpperCase();
};
