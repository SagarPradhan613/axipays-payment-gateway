import type { ReactNode } from 'react';
import type { TFunction } from 'i18next';
import type { CardType, Currency, PaymentStatus } from '@types';

export interface CheckoutFormValues {
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: string;
  currency: Currency;
  country: string;
  address: string;
  phone: string;
}

export interface FieldShellProps {
  label: string;
  error?: string;
  isFocused: boolean;
  children: ReactNode;
  action?: ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
  leading?: string;
}

export interface CreditCardPreviewProps {
  cardType: CardType;
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isFlipped: boolean;
  t: TFunction;
}

export interface StatusModalContentProps {
  status: PaymentStatus;
  t: TFunction;
}

export interface CheckoutStatusSidebarProps {
  cardHolderName: string;
  cardNumber: string;
  cardType: CardType;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  focusedField: string | null;
  paymentStatus: PaymentStatus | null;
  t: TFunction;
}

