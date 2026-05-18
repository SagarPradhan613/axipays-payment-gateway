import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import type { PaymentStatus } from '@types';
import type { StatusModalContentProps } from '@pages/Checkout/checkout.types';

interface StatusIllustrationProps {
  status: PaymentStatus;
}

/**
 * Renders the animated illustration for a payment result status.
 */
const StatusIllustration = ({ status }: StatusIllustrationProps) => {
  if (status === 'success') {
    return (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center text-success"
      >
        <CheckCircle2 className="h-16 w-16" />
      </motion.div>
    );
  }

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ x: -8, opacity: 0 }}
        animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="flex justify-center text-danger"
      >
        <XCircle className="h-16 w-16" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 0.95 }}
      animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.02, 0.98] }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      className="flex justify-center text-warning"
    >
      <Clock3 className="h-16 w-16" />
    </motion.div>
  );
};

/**
 * Displays the localized body content for the payment status modal.
 */
export const StatusModalContent = ({ status, t }: StatusModalContentProps) => (
  <div className="space-y-5 text-center">
    <StatusIllustration status={status} />
    <div className="space-y-2">
      <p className="font-display text-2xl font-bold text-ink">
        {t(`checkout:statusModal.${status}.title`)}
      </p>
      <p className="text-sm leading-6 text-muted">
        {t(`checkout:statusModal.${status}.description`)}
      </p>
    </div>
    <div className="flex justify-center">
      <Badge status={status}>{t(`common:statuses.${status}`)}</Badge>
    </div>
  </div>
);

