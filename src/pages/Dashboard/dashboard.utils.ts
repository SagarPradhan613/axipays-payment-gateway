import type { TFunction } from 'i18next';
import { DASHBOARD_CURRENCY_PALETTE, DASHBOARD_STATUS_COLORS } from '@constants';
import type { PaymentStatus, Transaction } from '@types';
import { formatCurrencyAmount, formatExpiryDisplay } from '@utils';
import type { SortDirection, SortField } from '@pages/Dashboard/dashboard.types';

/**
 * Compresses page navigation into a shorter, more readable sequence with ellipses.
 */
export const buildPaginationItems = (currentPage: number, totalPages: number): Array<number | 'ellipsis'> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
};

/**
 * Converts an ISO date string into a compact dashboard label.
 */
export const formatChartDate = (value?: string) => {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
};

/**
 * Masks the table card number to first six digits, hidden middle, and last four digits.
 */
export const formatTableCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) {
    return '--';
  }

  return `${digits.slice(0, 6)} *** ${digits.slice(-4)}`;
};

/**
 * Groups transactions by status for the dashboard donut chart.
 */
export const buildStatusChartData = (transactions: Transaction[], t: TFunction) => {
  const counts = transactions.reduce<Record<PaymentStatus, number>>(
    (accumulator, transaction) => ({
      ...accumulator,
      [transaction.status]: accumulator[transaction.status] + 1,
    }),
    { success: 0, failed: 0, pending: 0 },
  );

  return (Object.keys(counts) as PaymentStatus[]).map((status) => ({
    name: t(`common:statuses.${status}`),
    status,
    value: counts[status],
    color: DASHBOARD_STATUS_COLORS[status],
  }));
};

/**
 * Groups transactions by creation date and sums volume for the time-series chart.
 */
export const buildVolumeChartData = (transactions: Transaction[]) => {
  const grouped = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const key = transaction.createdAt?.slice(0, 10) ?? 'unknown';
    return {
      ...accumulator,
      [key]: (accumulator[key] ?? 0) + transaction.amount,
    };
  }, {});

  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, amount]) => ({
      date,
      label: date === 'unknown' ? '--' : formatChartDate(date),
      amount: Number(amount.toFixed(2)),
    }));
};

/**
 * Groups transactions by currency for the distribution donut chart.
 */
export const buildCurrencyChartData = (transactions: Transaction[]) => {
  const grouped = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    return {
      ...accumulator,
      [transaction.currency]: (accumulator[transaction.currency] ?? 0) + 1,
    };
  }, {});

  return Object.entries(grouped).map(([currency, count], index) => ({
    name: currency,
    value: count,
    color: DASHBOARD_CURRENCY_PALETTE[index % DASHBOARD_CURRENCY_PALETTE.length],
  }));
};

/**
 * Sorts transactions client-side using the selected column and direction.
 */
export const sortTransactions = (
  transactions: Transaction[],
  sortField: SortField,
  sortDirection: SortDirection,
) => {
  const sorted = [...transactions].sort((left, right) => {
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'amount') {
      return (left.amount - right.amount) * direction;
    }

    if (sortField === 'createdAt') {
      return ((left.createdAt ?? '').localeCompare(right.createdAt ?? '')) * direction;
    }

    return String(left[sortField] ?? '').localeCompare(String(right[sortField] ?? '')) * direction;
  });

  return sorted;
};

/**
 * Exports a collection of transactions to CSV using the currently filtered row set.
 */
export const exportTransactionsToCsv = (transactions: Transaction[], locale: string) => {
  const headers = ['Order ID', 'Card Number', 'Email', 'Expiry', 'Card CVC', 'Amount', 'Currency', 'Status'];
  const rows = transactions.map((transaction) => [
    transaction.orderId,
    formatTableCardNumber(transaction.cardNumber),
    transaction.email,
    formatExpiryDisplay(transaction.expiryMonth, transaction.expiryYear),
    '***',
    formatCurrencyAmount(transaction.amount, transaction.currency, locale),
    transaction.currency,
    transaction.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'axipays-transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Copies an order id to the clipboard.
 */
export const copyOrderId = async (orderId: string) => {
  await navigator.clipboard.writeText(orderId);
};

