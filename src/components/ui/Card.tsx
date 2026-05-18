import type { HTMLAttributes } from 'react';
import { cn } from '@utils';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-4xl bg-surface p-6 shadow-soft',
      className,
    )}
    {...props}
  />
);
