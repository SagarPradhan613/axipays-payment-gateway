import { useEffect, useMemo } from 'react';
import { getTransactions } from '@services';
import { useTransactionStore } from '@store';
import type { Transaction } from '@types';

type TransactionsResponse = Awaited<ReturnType<typeof getTransactions>>;

const pageRequests = new Map<string, Promise<TransactionsResponse>>();
const analyticsRequests = new Map<number, Promise<TransactionsResponse>>();

/**
 * Reuses an in-flight paginated request so Strict Mode remounts do not duplicate network calls.
 */
const fetchPageTransactions = (page: number, limit: number) => {
  const key = `${page}-${limit}`;
  const existingRequest = pageRequests.get(key);

  if (existingRequest) {
    return existingRequest;
  }

  const request = getTransactions(page, limit).finally(() => {
    pageRequests.delete(key);
  });

  pageRequests.set(key, request);
  return request;
};

/**
 * Reuses an in-flight analytics request for the full transaction collection.
 */
const fetchAnalyticsTransactions = (total: number) => {
  const existingRequest = analyticsRequests.get(total);

  if (existingRequest) {
    return existingRequest;
  }

  const request = getTransactions(1, total).finally(() => {
    analyticsRequests.delete(total);
  });

  analyticsRequests.set(total, request);
  return request;
};

/**
 * Computes aggregate dashboard metrics from the fetched transaction collection.
 */
const computeMetrics = (transactions: Transaction[]) => {
  const totalCount = transactions.length;
  const successTransactions = transactions.filter((transaction) => transaction.status === 'success');
  const successVolume = successTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const successCount = successTransactions.length;
  const failedCount = transactions.filter((transaction) => transaction.status !== 'success').length;

  return {
    totalCount,
    successVolume,
    successCount,
    failedCount,
  };
};

/**
 * Fetches transactions on mount, stores them in Zustand, and exposes derived dashboard values.
 */
export const useTransactions = () => {
  const {
    transactions,
    analyticsTransactions,
    pagination,
    isFetching,
    error,
    setTransactions,
    setAnalyticsTransactions,
    setPagination,
    updatePagination,
    setFetching,
    setError,
  } = useTransactionStore();

  /**
   * Loads the current paginated transaction slice and refreshes analytics data when needed.
   */
  const refetch = async () => {
    setFetching(true);
    setError(null);

    try {
      const response = await fetchPageTransactions(pagination.page, pagination.limit);
      setTransactions(response.items);
      setPagination(response.meta);

      if (analyticsTransactions.length !== response.meta.total) {
        const analyticsResponse = await fetchAnalyticsTransactions(response.meta.total);
        setAnalyticsTransactions(analyticsResponse.items);
      }
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError.message : 'Failed to load transactions.';
      setError(nextError);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void refetch();
  }, [pagination.page, pagination.limit]);

  const metrics = useMemo(() => computeMetrics(analyticsTransactions), [analyticsTransactions]);

  return {
    transactions,
    analyticsTransactions,
    pagination,
    isLoading: isFetching,
    error,
    isEmpty: !isFetching && !error && analyticsTransactions.length === 0,
    refetch,
    updatePagination,
    ...metrics,
  };
};
