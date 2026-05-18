import type { TFunction } from 'i18next';
import { Button } from '@components/ui/Button';
import { Dropdown } from '@components/ui/Dropdown';
import type { PaginationMeta } from '@types';
import { cn } from '@utils';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((pageSize) => ({
  value: String(pageSize),
  pageSize,
}));

interface DashboardPaginationProps {
  pagination: PaginationMeta;
  paginationItems: Array<number | 'ellipsis'>;
  t: TFunction;
  totalPages: number;
  totalTransactions: number;
  updatePagination: (pagination: Partial<PaginationMeta>) => void;
}

export const DashboardPagination = ({
  pagination,
  paginationItems,
  t,
  totalPages,
  totalTransactions,
  updatePagination,
}: DashboardPaginationProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        {t('dashboard:table.paginationSummary', {
          start: totalTransactions > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0,
          end: Math.min(pagination.page * pagination.limit, totalTransactions),
          total: totalTransactions,
        })}
      </p>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <label className="text-sm font-medium text-muted">
          {t('dashboard:table.rowsPerPage')}
        </label>
        <div className="min-w-[140px]">
          <Dropdown
            value={String(pagination.limit)}
            placeholder={t('dashboard:table.rowsPerPage')}
            options={PAGE_SIZE_OPTIONS.map(({ value, pageSize }) => ({
              value,
              label: t('dashboard:filters.pageSize', { count: pageSize }),
            }))}
            onChange={(value) =>
              updatePagination({
                page: 1,
                limit: Number(value),
              })
            }
            className="h-10 min-h-10"
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => updatePagination({ page: Math.max(1, pagination.page - 1) })}
        disabled={pagination.page === 1}
        className="h-9 rounded-xl border-line/40 bg-transparent px-4 text-muted hover:bg-white/[0.04] hover:text-ink"
      >
        {t('dashboard:actions.previous')}
      </Button>

      {paginationItems.map((pageItem, index) =>
        pageItem === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted">
            ...
          </span>
        ) : (
          <button
            key={pageItem}
            type="button"
            onClick={() => updatePagination({ page: pageItem })}
            className={cn(
              'h-9 min-w-9 rounded-xl px-3 text-sm font-semibold transition',
              pagination.page === pageItem
                ? 'bg-brand-600 text-white shadow-glow'
                : 'border border-line/30 bg-transparent text-muted hover:bg-white/[0.04] hover:text-ink',
            )}
          >
            {pageItem}
          </button>
        ),
      )}

      <Button
        size="sm"
        variant="secondary"
        onClick={() => updatePagination({ page: Math.min(totalPages, pagination.page + 1) })}
        disabled={pagination.page === totalPages}
        className="h-9 rounded-xl border-line/40 bg-transparent px-4 text-muted hover:bg-white/[0.04] hover:text-ink"
      >
        {t('dashboard:actions.next')}
      </Button>
    </div>
  </div>
);
