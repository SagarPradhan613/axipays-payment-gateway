import type { TFunction } from 'i18next';
import type { PaginationMeta, PaymentStatus, Transaction } from '@types';
import type { useTransactions } from '@hooks';

export type SortField = 'orderId' | 'email' | 'amount' | 'currency' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SummaryCardProps {
  label: string;
  value: number;
  format?: 'number' | 'currency';
  currency?: string;
  locale: string;
  accentClass: string;
  footer?: string;
}

export interface SummarySectionProps {
  locale: string;
  totalCount: number;
  successVolume: number;
  successCount: number;
  failedCount: number;
  t: TFunction;
}

export interface ChartsSectionProps {
  axisColor: string;
  currencyChartData: Array<{ name: string; value: number; color: string }>;
  isLoading: boolean;
  locale: string;
  statusChartData: Array<{ name: string; status: PaymentStatus; value: number; color: string }>;
  theme: 'light' | 'dark';
  tooltipBackground: string;
  tooltipText: string;
  totalCount: number;
  t: TFunction;
  volumeChartData: Array<{ date: string; label: string; amount: number }>;
}

export interface TableSectionProps {
  error: string | null;
  handleCopyOrderId: (orderId: string) => Promise<void>;
  handleExportCsv: () => void;
  handleSort: (field: SortField) => void;
  isClientMode: boolean;
  isLoading: boolean;
  locale: string;
  paginatedTransactions: Transaction[];
  pagination: ReturnType<typeof useTransactions>['pagination'];
  paginationItems: Array<number | 'ellipsis'>;
  refetch: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: 'all' | PaymentStatus) => void;
  sortedTransactions: Transaction[];
  sortDirection: SortDirection;
  sortField: SortField;
  statusFilter: 'all' | PaymentStatus;
  statusFilterOptions: Array<{ value: string; label: string }>;
  t: TFunction;
  totalPages: number;
  transactions: Transaction[];
  updatePagination: (pagination: Partial<PaginationMeta>) => void;
}

export interface DashboardHeaderProps {
  t: TFunction;
}

