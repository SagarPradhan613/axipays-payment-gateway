import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@components/ui/Card';
import { DASHBOARD_THEME_COLORS } from '@constants';
import type { ChartsSectionProps } from '@pages/Dashboard/dashboard.types';
import { formatCurrencyAmount } from '@utils';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

/**
 * Wraps a dashboard chart in consistent card styling and entrance animation.
 */
const ChartCard = ({ title, children }: ChartCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.28 }}
  >
    <Card className="h-full space-y-4 rounded-[18px] border-transparent bg-surface/80 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.14)] dark:bg-[#1e1e1e] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_34px_rgba(0,0,0,0.42)]">
      <div>
        <h2 className="font-display text-[1.35rem] font-semibold text-ink">{title}</h2>
      </div>
      <div className="h-72">{children}</div>
    </Card>
  </motion.div>
);

export const DashboardChartsSection = ({
  axisColor,
  currencyChartData,
  isLoading,
  locale,
  statusChartData,
  theme,
  tooltipBackground,
  tooltipText,
  totalCount,
  t,
  volumeChartData,
}: ChartsSectionProps) => (
  <div className="grid gap-4 xl:grid-cols-3">
    <ChartCard title={t('dashboard:charts.statusBreakdown')}>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-24 w-24 animate-pulse rounded-full border-8 border-slate-200 dark:border-slate-800" />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={92}
                  paddingAngle={4}
                  isAnimationActive
                >
                  {statusChartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBackground, border: 'none', borderRadius: 16, color: tooltipText }}
                  itemStyle={{ color: tooltipText }}
                  labelStyle={{ color: tooltipText }}
                />
                <text x="50%" y="45%" textAnchor="middle" fill={DASHBOARD_THEME_COLORS[theme].axis} fontSize="12" fontWeight="600">
                  {t('dashboard:charts.totalLabel')}
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  fill={DASHBOARD_THEME_COLORS[theme].chartValueText}
                  fontSize="30"
                  fontWeight="700"
                >
                  {totalCount}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusChartData.map((entry) => (
              <div key={entry.status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </div>
                <span className="text-muted">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>

    <ChartCard title={t('dashboard:charts.volumeOverTime')}>
      {isLoading ? (
        <div className="h-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumeChartData} margin={{ left: 0, right: 0, top: 16, bottom: 0 }}>
            <XAxis dataKey="label" stroke={axisColor} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              stroke={axisColor}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackground, border: 'none', borderRadius: 16, color: tooltipText }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: tooltipText }}
              formatter={(value: number) => formatCurrencyAmount(value, 'USD', locale)}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#b79bf8" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>

    <ChartCard title={t('dashboard:charts.currencyDistribution')}>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-24 w-24 animate-pulse rounded-full border-8 border-slate-200 dark:border-slate-800" />
        </div>
      ) : (
        <div className="space-y-5 pt-2">
          {currencyChartData.map((entry) => {
            const total = currencyChartData.reduce((sum, item) => sum + item.value, 0);
            const percentage = total ? Math.round((entry.value / total) * 100) : 0;

            return (
              <div key={entry.name} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-ink">
                      {entry.name[0]}
                    </span>
                    <span className="text-sm font-semibold text-ink">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-muted">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: entry.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  </div>
);
