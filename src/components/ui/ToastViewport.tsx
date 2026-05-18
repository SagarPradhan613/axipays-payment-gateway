import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '@store';
import { cn } from '@utils';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

const toneMap = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-100',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-100',
  info: 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900/30 dark:bg-brand-900/20 dark:text-brand-100',
} as const;

/**
 * Renders transient toast notifications near the viewport edge.
 */
export const ToastViewport = () => {
  const { t } = useTranslation();
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 sm:justify-end">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = iconMap[toast.variant];

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                className={cn(
                  'pointer-events-auto rounded-3xl border p-4 shadow-soft backdrop-blur',
                  toneMap[toast.variant],
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.description ? <p className="mt-1 text-sm opacity-85">{toast.description}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="rounded-full p-1 opacity-70 transition hover:bg-white/30 hover:opacity-100"
                    aria-label={t('common:actions.dismiss')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
