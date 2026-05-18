import { API_ENDPOINTS } from '@constants';
import { api } from '@services/api';

export interface InitiatePaymentPayload {
  orderId: string;
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC: string;
  amount: number;
  currency: string;
  country: string;
  address: string;
  phone: string;
}

interface PaymentApiResponse {
  redirect_url?: string;
  status?: string;
  payment_status?: string;
  message?: string;
  data?: {
    redirect_url?: string;
    status?: string;
    payment_status?: string;
  };
}

export interface InitiatePaymentResponse {
  message?: string;
  redirect_url: string | null;
  status: string | null;
}

/**
 * Normalizes the payment initiation API response shape into a predictable object.
 */
const normalizePaymentResponse = (response: PaymentApiResponse): InitiatePaymentResponse => ({
  message: response.message,
  redirect_url:
    response.redirect_url ??
    response.data?.redirect_url ??
    null,
  status:
    response.status ?? response.payment_status ?? response.data?.status ?? response.data?.payment_status ?? null,
});

/**
 * Sends the checkout payload to the payment initiation endpoint with the required hash header.
 */
export const initiatePayment = async (payload: InitiatePaymentPayload, hash: string) => {
  const response = await api.post<PaymentApiResponse>(API_ENDPOINTS.initiatePayment, payload, {
    headers: {
      Hash: hash,
    },
  });

  return normalizePaymentResponse(response.data);
};
