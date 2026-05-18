export type PaymentStatus = 'success' | 'failed' | 'pending';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export interface CardDetails {
  holderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CountryOption {
  code: string;
  value: string;
  flag: string;
  labelKey: string;
}

export interface CheckoutFormData {
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
  currency: Currency;
  country: string;
  address: string;
  phone: string;
}

export interface Transaction {
  orderId: string;
  cardHolderName?: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC?: string;
  cvv?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaymentRedirectResponse {
  redirect_url: string;
  status: PaymentStatus | 'Error';
  message?: string;
}
