import { motion } from 'framer-motion';
import type { DashboardHeaderProps } from '@pages/Dashboard/dashboard.types';

export const DashboardHeader = ({ t }: DashboardHeaderProps) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
    className="space-y-3"
  >
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
      {t('dashboard:eyebrow')}
    </p>
    <h1 className="font-display text-[2.5rem] font-semibold tracking-tight text-ink">
      {t('dashboard:title')}
    </h1>
    <p className="max-w-4xl text-sm leading-7 text-muted">{t('dashboard:description')}</p>
  </motion.div>
);

