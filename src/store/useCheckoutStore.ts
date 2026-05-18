import { create } from 'zustand';
import type { CheckoutFormData, Currency, PaymentStatus } from '@types';

interface CheckoutStore {
  draft: Partial<CheckoutFormData>;
  amount: number | null;
  selectedCurrency: Currency;
  paymentStatus: PaymentStatus | null;
  redirectionUrl: string | null;
  setDraft: (draft: Partial<CheckoutFormData>) => void;
  setAmount: (amount: number | null) => void;
  setSelectedCurrency: (currency: Currency) => void;
  setPaymentStatus: (status: PaymentStatus | null) => void;
  setRedirectionUrl: (url: string | null) => void;
  resetCheckout: () => void;
}

const initialState: Pick<
  CheckoutStore,
  'draft' | 'amount' | 'selectedCurrency' | 'paymentStatus' | 'redirectionUrl'
> = {
  draft: {},
  amount: null,
  selectedCurrency: 'USD',
  paymentStatus: null,
  redirectionUrl: null,
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...initialState,
  setDraft: (draft) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...draft,
      },
    })),
  setAmount: (amount) => set({ amount }),
  setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
  setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
  setRedirectionUrl: (redirectionUrl) => set({ redirectionUrl }),
  resetCheckout: () => set(initialState),
}));
