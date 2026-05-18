import { create } from 'zustand';
import type { PaginationMeta, Transaction } from '@types';

interface TransactionStore {
  transactions: Transaction[];
  analyticsTransactions: Transaction[];
  selectedTransactionId: string | null;
  pagination: PaginationMeta;
  isFetching: boolean;
  error: string | null;
  setTransactions: (transactions: Transaction[]) => void;
  setAnalyticsTransactions: (transactions: Transaction[]) => void;
  appendTransactions: (transactions: Transaction[]) => void;
  setSelectedTransactionId: (id: string | null) => void;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
  updatePagination: (pagination: Partial<PaginationMeta>) => void;
  setFetching: (fetching: boolean) => void;
  setError: (error: string | null) => void;
  resetTransactions: () => void;
}

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  analyticsTransactions: [],
  selectedTransactionId: null,
  pagination: initialPagination,
  isFetching: false,
  error: null,
  setTransactions: (transactions) => set({ transactions }),
  setAnalyticsTransactions: (analyticsTransactions) => set({ analyticsTransactions }),
  appendTransactions: (transactions) =>
    set((state) => ({
      transactions: [...state.transactions, ...transactions],
    })),
  setSelectedTransactionId: (selectedTransactionId) => set({ selectedTransactionId }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    })),
  updatePagination: (pagination) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    })),
  setFetching: (isFetching) => set({ isFetching }),
  setError: (error) => set({ error }),
  resetTransactions: () =>
    set({
      transactions: [],
      analyticsTransactions: [],
      selectedTransactionId: null,
      pagination: initialPagination,
      isFetching: false,
      error: null,
    }),
}));
