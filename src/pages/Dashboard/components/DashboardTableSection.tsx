import { motion } from 'framer-motion';
import { AlertCircle, Download, Search } from 'lucide-react';
import { DashboardPagination } from '@components/shared/dashboard/DashboardPagination';
import { DashboardTransactionTable } from '@components/shared/dashboard/DashboardTransactionTable';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Dropdown } from '@components/ui/Dropdown';
import { Input } from '@components/ui/Input';
import type { PaymentStatus } from '@types';
import type { TableSectionProps } from '@pages/Dashboard/dashboard.types';

export const DashboardTableSection = ({
  error,
  handleCopyOrderId,
  handleExportCsv,
  handleSort,
  isClientMode,
  isLoading,
  locale,
  paginatedTransactions,
  pagination,
  paginationItems,
  refetch,
  searchQuery,
  setSearchQuery,
  setStatusFilter,
  sortedTransactions,
  sortDirection,
  sortField,
  statusFilter,
  statusFilterOptions,
  t,
  totalPages,
  transactions,
  updatePagination,
}: TableSectionProps) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
    <Card className="space-y-5 rounded-[18px] border-transparent bg-surface/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('dashboard:filters.searchPlaceholder')}
            className="w-full bg-app/45 pl-12 pr-4"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[180px]">
            <Dropdown
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | PaymentStatus)}
              placeholder={t('dashboard:filters.allStatuses')}
              className="min-h-[44px] bg-app/40"
            />
          </div>

          <Button variant="primary" onClick={handleExportCsv} className="min-h-[44px] gap-2 rounded-xl px-4">
            <Download className="h-4 w-4" />
            {t('dashboard:actions.exportCsv')}
          </Button>
        </div>
      </div>

      <DashboardTransactionTable
        handleCopyOrderId={handleCopyOrderId}
        handleSort={handleSort}
        isLoading={isLoading}
        locale={locale}
        paginatedTransactions={paginatedTransactions}
        sortDirection={sortDirection}
        sortField={sortField}
        t={t}
      />

      {error && transactions.length ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger dark:border-red-900/30 dark:bg-red-900/10">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
          <Button size="sm" variant="ghost" onClick={() => void refetch()}>
            {t('dashboard:actions.retry')}
          </Button>
        </div>
      ) : null}

      <DashboardPagination
        pagination={pagination}
        paginationItems={paginationItems}
        t={t}
        totalPages={totalPages}
        totalTransactions={isClientMode ? sortedTransactions.length : pagination.total}
        updatePagination={updatePagination}
      />
    </Card>
  </motion.div>
);
