import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { EmptyState } from '@components/shared/EmptyState';
import { ErrorState } from '@components/shared/ErrorState';
import { Button } from '@components/ui/Button';
import { DASHBOARD_THEME_COLORS } from '@constants';
import { usePageTitle, useTransactions } from '@hooks';
import { useThemeStore, useToastStore } from '@store';
import type { PaymentStatus } from '@types';
import { DashboardChartsSection, DashboardHeader, DashboardSummarySection, DashboardTableSection } from '@pages/Dashboard/components';
import type { SortDirection, SortField } from '@pages/Dashboard/dashboard.types';
import {
  buildCurrencyChartData,
  buildPaginationItems,
  buildStatusChartData,
  buildVolumeChartData,
  copyOrderId,
  exportTransactionsToCsv,
  sortTransactions,
} from '@pages/Dashboard/dashboard.utils';

export const DashboardPage = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { theme } = useThemeStore();
  const { pushToast } = useToastStore();
  const {
    transactions,
    analyticsTransactions,
    pagination,
    isLoading,
    error,
    isEmpty,
    refetch,
    updatePagination,
    totalCount,
    successVolume,
    successCount,
    failedCount,
  } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  usePageTitle(t('dashboard:metaTitle'));

  const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
  const themeColors = DASHBOARD_THEME_COLORS[theme];

  const isClientMode =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    sortField !== 'createdAt' ||
    sortDirection !== 'desc';

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return analyticsTransactions.filter((transaction) => {
      const matchesQuery =
        !query ||
        transaction.email.toLowerCase().includes(query) ||
        transaction.orderId.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [analyticsTransactions, searchQuery, statusFilter]);

  const sortedTransactions = useMemo(
    () => sortTransactions(filteredTransactions, sortField, sortDirection),
    [filteredTransactions, sortDirection, sortField],
  );

  const totalPages = isClientMode
    ? Math.max(1, Math.ceil(sortedTransactions.length / pagination.limit))
    : Math.max(1, pagination.totalPages);

  useEffect(() => {
    if (pagination.page > totalPages) {
      updatePagination({ page: totalPages });
    }
  }, [pagination.page, totalPages, updatePagination]);

  useEffect(() => {
    updatePagination({ page: 1 });
  }, [searchQuery, sortDirection, sortField, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    if (!isClientMode) {
      return transactions;
    }

    const start = (pagination.page - 1) * pagination.limit;
    return sortedTransactions.slice(start, start + pagination.limit);
  }, [isClientMode, pagination.limit, pagination.page, sortedTransactions, transactions]);

  const statusChartData = useMemo(() => buildStatusChartData(analyticsTransactions, t), [analyticsTransactions, t]);
  const volumeChartData = useMemo(() => buildVolumeChartData(analyticsTransactions), [analyticsTransactions]);
  const currencyChartData = useMemo(() => buildCurrencyChartData(analyticsTransactions), [analyticsTransactions]);
  const statusFilterOptions = useMemo(
    () => [
      { value: 'all', label: t('dashboard:filters.allStatuses') },
      { value: 'success', label: t('common:statuses.success') },
      { value: 'failed', label: t('common:statuses.failed') },
      { value: 'pending', label: t('common:statuses.pending') },
    ],
    [t],
  );

  /**
   * Updates the table sort state when a sortable column header is clicked.
   */
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDirection('asc');
  }, [sortField]);

  const paginationItems = buildPaginationItems(pagination.page, totalPages);

  /**
   * Exports the filtered dataset and confirms the action with a toast.
   */
  const handleExportCsv = useCallback(() => {
    exportTransactionsToCsv(sortedTransactions, locale);
    pushToast({
      title: t('dashboard:toasts.exportSuccessTitle'),
      description: t('dashboard:toasts.exportSuccessDescription'),
      variant: 'success',
    });
  }, [locale, pushToast, sortedTransactions, t]);

  /**
   * Copies an order id and reports success or failure through a toast.
   */
  const handleCopyOrderId = useCallback(async (orderId: string) => {
    try {
      await copyOrderId(orderId);
      pushToast({
        title: t('dashboard:toasts.copySuccessTitle'),
        description: t('dashboard:toasts.copySuccessDescription'),
        variant: 'success',
      });
    } catch {
      pushToast({
        title: t('dashboard:toasts.copyErrorTitle'),
        description: t('dashboard:toasts.copyErrorDescription'),
        variant: 'error',
      });
    }
  }, [pushToast, t]);

  return (
    <motion.section
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      <DashboardHeader t={t} />

      {error && !transactions.length ? (
        <ErrorState
          title={t('dashboard:states.errorTitle')}
          description={error}
          action={
            <Button onClick={() => void refetch()}>{t('dashboard:actions.retry')}</Button>
          }
        />
      ) : null}

      {!error ? (
        <>
          <DashboardSummarySection
            locale={locale}
            totalCount={totalCount}
            successVolume={successVolume}
            successCount={successCount}
            failedCount={failedCount}
            t={t}
          />
          <DashboardChartsSection
            axisColor={themeColors.axis}
            currencyChartData={currencyChartData}
            isLoading={isLoading}
            locale={locale}
            statusChartData={statusChartData}
            theme={theme}
            tooltipBackground={themeColors.tooltipBackground}
            tooltipText={themeColors.tooltipText}
            totalCount={totalCount}
            t={t}
            volumeChartData={volumeChartData}
          />
          {isEmpty ? (
            <EmptyState
              title={t('dashboard:states.emptyTitle')}
              description={t('dashboard:states.emptyDescription')}
            />
          ) : (
            <DashboardTableSection
              error={error}
              handleCopyOrderId={handleCopyOrderId}
              handleExportCsv={handleExportCsv}
              handleSort={handleSort}
              isClientMode={isClientMode}
              isLoading={isLoading}
              locale={locale}
              paginatedTransactions={paginatedTransactions}
              pagination={pagination}
              paginationItems={paginationItems}
              refetch={refetch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setStatusFilter={setStatusFilter}
              sortedTransactions={sortedTransactions}
              sortDirection={sortDirection}
              sortField={sortField}
              statusFilter={statusFilter}
              statusFilterOptions={statusFilterOptions}
              t={t}
              totalPages={totalPages}
              transactions={transactions}
              updatePagination={updatePagination}
            />
          )}
        </>
      ) : null}
    </motion.section>
  );
};
