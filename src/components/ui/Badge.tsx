import type { PropsWithChildren } from 'react';
import { cn } from '@utils';
import type { PaymentStatus } from '@types';

interface BadgeProps extends PropsWithChildren {
  status?: PaymentStatus;
  className?: string;
}

const statusStyles: Record<PaymentStatus, string> = {
  success: 'bg-[rgba(16,185,129,0.1)] text-[#10B981]',
  failed: 'bg-[rgba(244,63,94,0.1)] text-[#F43F5E]',
  pending: 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]',
};

export const Badge = ({ children, status = 'pending', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
      statusStyles[status],
      className,
    )}
  >
    {children}
  </span>
);
