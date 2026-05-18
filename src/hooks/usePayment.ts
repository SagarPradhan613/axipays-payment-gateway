import { useEffect, useRef, useState } from 'react';
import i18n from '@/i18n';
import { initiatePayment as initiatePaymentRequest } from '@services';
import { useCheckoutStore } from '@store';
import type { CheckoutFormData, PaymentRedirectResponse, PaymentStatus } from '@types';
import { generateHmacHash, generateOrderId } from '@utils';
import type { InitiatePaymentPayload } from '@services/paymentService';

interface PopupMessagePayload {
  status?: string;
  paymentStatus?: string;
  type?: string;
}

/**
 * Extracts a normalized payment status from API fields, URLs, or postMessage payloads.
 */
const normalizePaymentStatus = (value: string | null | undefined): PaymentStatus | null => {
  const normalized = value?.toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized.includes('success')) {
    return 'success';
  }

  if (normalized.includes('fail')) {
    return 'failed';
  }

  if (normalized.includes('pending')) {
    return 'pending';
  }

  return null;
};

/**
 * Fetches the redirect endpoint directly and extracts the final JSON status when available.
 */
const resolveRedirectStatus = async (redirectUrl: string): Promise<PaymentStatus | null> => {
  const response = await fetch(redirectUrl, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(i18n.t('checkout:errors.redirectStatusFailed'));
  }

  const payload = (await response.json()) as Partial<PaymentRedirectResponse>;
  return normalizePaymentStatus(payload.status);
};

/**
 * Coordinates payment initiation, redirect handling, and status updates for checkout.
 */
export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const popupRef = useRef<Window | null>(null);
  const { setPaymentStatus: setCheckoutStatus, setRedirectionUrl } = useCheckoutStore();

  useEffect(() => {
    /**
     * Updates checkout state when the redirect flow posts back a status payload.
     */
    const handleMessage = (event: MessageEvent<PopupMessagePayload | string>) => {
      const payloadStatus =
        typeof event.data === 'string'
          ? normalizePaymentStatus(event.data)
          : normalizePaymentStatus(event.data?.paymentStatus ?? event.data?.status ?? event.data?.type);

      if (payloadStatus) {
        setPaymentStatus(payloadStatus);
        setCheckoutStatus(payloadStatus);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setCheckoutStatus]);

  /**
   * Clears redirect and status state after the user finishes with the current payment flow.
   */
  const resetPaymentFlow = () => {
    setRedirectUrl(null);
    setPaymentStatus(null);
    setCheckoutStatus(null);
    setRedirectionUrl(null);
  };

  /**
   * Initiates the payment request and exposes redirect data to the checkout UI.
   */
  const initiatePayment = async (payload: CheckoutFormData) => {
    setIsLoading(true);
    setError(null);
    const popup = window.open('', '_blank', 'width=1200,height=800');
    popupRef.current = popup;

    try {
      const sanitizedCardNumber = payload.cardNumber.replace(/\s+/g, '');
      const requestPayload: InitiatePaymentPayload = {
        orderId: generateOrderId(),
        cardHolderName: payload.cardHolderName,
        email: payload.email,
        cardNumber: sanitizedCardNumber,
        expiryMonth: payload.expiryMonth,
        expiryYear: payload.expiryYear,
        cardCVC: payload.cvv,
        amount: payload.amount,
        currency: payload.currency,
        country: payload.country,
        address: payload.address,
        phone: payload.phone,
      };
      const hash = generateHmacHash(sanitizedCardNumber, payload.email);
      const response = await initiatePaymentRequest(requestPayload, hash);
      const nextRedirectUrl = response.redirect_url;

      if (!nextRedirectUrl) {
        throw new Error(i18n.t('checkout:errors.redirectMissing'));
      }

      if (popupRef.current) {
        popupRef.current.location.href = nextRedirectUrl;
      }
      setRedirectUrl(nextRedirectUrl);
      setRedirectionUrl(nextRedirectUrl);

      const nextStatus =
        (await resolveRedirectStatus(nextRedirectUrl).catch(() => null)) ??
        normalizePaymentStatus(response.status) ??
        'pending';

      setPaymentStatus(nextStatus);
      setCheckoutStatus(nextStatus);

      return {
        redirectUrl: nextRedirectUrl,
        paymentStatus: nextStatus,
      };
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : i18n.t('checkout:errors.initiationFailed');

      setError(message);
      setPaymentStatus('failed');
      setCheckoutStatus('failed');
      popupRef.current?.close();

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
    redirectUrl,
    paymentStatus,
    resetPaymentFlow,
  };
};
