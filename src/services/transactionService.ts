import { API_ENDPOINTS } from '@constants';
import { api } from '@services/api';
import type { PaginationMeta, PaymentStatus, Transaction } from '@types';

interface RawTransaction {
  orderId: string;
  cardHolderName?: string;
  email?: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC?: string;
  amount: number;
  currency: string;
  country?: string;
  address?: string;
  phone?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TransactionsApiResponse {
  data: RawTransaction[];
  limit: number;
  message: string;
  page: number;
  status: string;
  total: number;
}

interface TransactionsPayload {
  items: Transaction[];
  meta: PaginationMeta;
}

/**
 * Normalizes the transaction status returned by the API into the app's union type.
 */
const normalizeStatus = (status: string): PaymentStatus => {
  const normalized = status.toLowerCase();

  if (normalized.includes('success')) {
    return 'success';
  }

  if (normalized.includes('pending')) {
    return 'pending';
  }

  return 'failed';
};

/**
 * Maps the raw transaction API payload into the dashboard transaction model.
 */
const normalizeTransaction = (transaction: RawTransaction): Transaction => ({
  orderId: transaction.orderId,
  cardHolderName: transaction.cardHolderName,
  email: transaction.email ?? '',
  cardNumber: transaction.cardNumber,
  expiryMonth: transaction.expiryMonth,
  expiryYear: transaction.expiryYear,
  cardCVC: transaction.cardCVC,
  amount: transaction.amount,
  currency: transaction.currency as Transaction['currency'],
  status: normalizeStatus(transaction.status),
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

/**
 * Fetches transactions and normalizes the backend response into a stable dashboard payload.
 */
export const getTransactions = async (page = 1, limit = 100): Promise<TransactionsPayload> => {
  const response = await api.get<TransactionsApiResponse>(API_ENDPOINTS.transactions, {
    params: { page, limit },
  });

  return {
    items: response.data.data.map(normalizeTransaction),
    meta: {
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total,
      totalPages: Math.ceil(response.data.total / response.data.limit),
    },
  };
};
