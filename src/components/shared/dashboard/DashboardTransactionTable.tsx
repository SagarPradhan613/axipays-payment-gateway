import { motion } from 'framer-motion';
import type { TFunction } from 'i18next';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import type { Transaction } from '@types';
import type { SortDirection, SortField } from '@pages/Dashboard/dashboard.types';
import { cn, formatCurrencyAmount, formatExpiryDisplay } from '@utils';
import { formatChartDate, formatTableCardNumber } from '@pages/Dashboard/dashboard.utils';

interface SortIndicatorProps {
  active: boolean;
  direction: SortDirection;
}

interface DashboardTransactionTableProps {
  handleCopyOrderId: (orderId: string) => Promise<void>;
  handleSort: (field: SortField) => void;
  isLoading: boolean;
  locale: string;
  paginatedTransactions: Transaction[];
  sortDirection: SortDirection;
  sortField: SortField;
  t: TFunction;
}

/**
 * Renders the sort direction indicator for a sortable table header.
 */
const SortIndicator = ({ active, direction }: SortIndicatorProps) => {
  if (!active) {
    return <ArrowUpDown className="h-4 w-4 text-muted" />;
  }

  return direction === 'asc' ? (
    <ArrowUp className="h-4 w-4 text-brand-600" />
  ) : (
    <ArrowDown className="h-4 w-4 text-brand-600" />
  );
};

/**
 * Renders loading skeleton rows while the dashboard table data is being fetched.
 */
const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 8 }, (_, index) => (
      <tr key={index} className="h-14 border-b border-line/30 last:border-none">
        {Array.from({ length: 8 }, (_, cellIndex) => (
          <td key={cellIndex} className="px-4 py-4">
            <div className="shimmer h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

export const DashboardTransactionTable = ({
  handleCopyOrderId,
  handleSort,
  isLoading,
  locale,
  paginatedTransactions,
  sortDirection,
  sortField,
  t,
}: DashboardTransactionTableProps) => (
  <div className="overflow-x-auto rounded-[18px] border border-line/30">
    <table className="min-w-full border-separate border-spacing-0">
      <thead className="bg-white/[0.02]">
        <tr>
          {(['orderId', 'email', 'amount', 'currency', 'status', 'createdAt'] as const).map((field) => (
            <th
              key={field}
              className={cn(
                'px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted',
                field === 'orderId' && 'min-w-[180px] bg-white/[0.03] lg:sticky lg:left-0 lg:z-20 lg:min-w-[240px]',
              )}
            >
              <button type="button" onClick={() => handleSort(field)} className="inline-flex items-center gap-2">
                <span>{t(`dashboard:table.columns.${field}`)}</span>
                <SortIndicator active={sortField === field} direction={sortDirection} />
              </button>
            </th>
          ))}
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t('dashboard:table.columns.cardNumber')}
          </th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t('dashboard:table.columns.expiry')}
          </th>
          <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t('dashboard:table.columns.cardCvc')}
          </th>
        </tr>
      </thead>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <tbody>
          {paginatedTransactions.map((transaction, index) => (
            <motion.tr
              key={transaction.orderId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.18 }}
              className={cn(
                'h-14 border-b border-line/20 last:border-none',
                index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]',
                'hover:bg-white/[0.035]',
              )}
            >
              <td className="min-w-[180px] bg-inherit px-4 py-4 lg:sticky lg:left-0 lg:z-10 lg:min-w-[240px]">
                <div className="flex items-center gap-2">
                  <span
                    className="max-w-[120px] truncate font-mono text-xs font-semibold text-brand-600 sm:max-w-[170px]"
                    title={transaction.orderId}
                  >
                    {transaction.orderId}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyOrderId(transaction.orderId)}
                    className="rounded-full p-1 text-muted transition hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5"
                    aria-label={t('dashboard:table.copyOrderId')}
                    title={t('dashboard:table.copyOrderId')}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className="min-w-[130px] px-4 py-4 text-muted">{transaction.email || '--'}</td>
              <td className="px-4 py-4 font-medium text-ink">
                {formatCurrencyAmount(transaction.amount, transaction.currency, locale)}
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
                  {transaction.currency}
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge status={transaction.status}>
                  {t(`common:statuses.${transaction.status}`)}
                </Badge>
              </td>
              <td className="min-w-[92px] px-4 py-4 text-muted">
                {transaction.createdAt ? formatChartDate(transaction.createdAt) : '--'}
              </td>
              <td className="min-w-[132px] px-4 py-4 font-mono text-xs text-muted">
                {formatTableCardNumber(transaction.cardNumber)}
              </td>
              <td className="min-w-[102px] px-4 py-4 text-ink">
                {formatExpiryDisplay(transaction.expiryMonth, transaction.expiryYear)}
              </td>
              <td className="min-w-[72px] px-4 py-4 font-mono text-ink">***</td>
            </motion.tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);
