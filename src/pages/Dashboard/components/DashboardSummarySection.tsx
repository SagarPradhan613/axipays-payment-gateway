import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { Card } from '@components/ui/Card';
import type { SummaryCardProps, SummarySectionProps } from '@pages/Dashboard/dashboard.types';
import { cn, formatCurrencyAmount } from '@utils';

/**
 * Animates summary metric values upward when the dashboard data loads.
 */
const SummaryCard = ({
  label,
  value,
  format = 'number',
  currency = 'USD',
  locale,
  accentClass,
  footer,
}: SummaryCardProps) => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.1,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [motionValue, value]);

  const renderedValue =
    format === 'currency'
      ? formatCurrencyAmount(displayValue, currency, locale)
      : Math.round(displayValue).toLocaleString(locale);

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
      <Card className="flex h-full min-h-[132px] flex-col justify-between rounded-[18px] border-transparent bg-surface/80 p-5 shadow-[0_14px_32px_rgba(15,15,15,0.12)] dark:bg-[#1e1e1e] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_34px_rgba(0,0,0,0.42),0_8px_18px_rgba(124,58,237,0.08)]">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
          <p className={cn('font-display text-[2.05rem] font-semibold leading-none', accentClass)}>{renderedValue}</p>
        </div>
        <div className="space-y-3">
          <div className="h-px w-full bg-white/6" />
          <p className="text-xs text-muted">{footer ?? '\u00A0'}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export const DashboardSummarySection = ({
  locale,
  totalCount,
  successVolume,
  successCount,
  failedCount,
  t,
}: SummarySectionProps) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <SummaryCard
      label={t('dashboard:summary.totalTransactions')}
      value={totalCount}
      locale={locale}
      accentClass="text-[#cbb6ff]"
      footer={t('dashboard:summary.footers.totalTransactions')}
    />
    <SummaryCard
      label={t('dashboard:summary.successVolume')}
      value={successVolume}
      format="currency"
      currency="USD"
      locale={locale}
      accentClass="text-[#43d17d]"
      footer={t('dashboard:summary.footers.successVolume')}
    />
    <SummaryCard
      label={t('dashboard:summary.successCount')}
      value={successCount}
      locale={locale}
      accentClass="text-[#43d17d]"
      footer={t('dashboard:summary.footers.successCount')}
    />
    <SummaryCard
      label={t('dashboard:summary.failedCount')}
      value={failedCount}
      locale={locale}
      accentClass="text-[#ffb0a5]"
      footer={t('dashboard:summary.footers.failedCount')}
    />
  </div>
);
