import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Card } from '@components/ui';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Card className="flex flex-col items-center justify-center gap-4 py-12 text-center">
    <div className="rounded-full bg-brand-50 p-4 text-brand-600 dark:bg-brand-900/20 dark:text-brand-200">
      <Inbox className="h-6 w-6" />
    </div>
    <div className="space-y-2">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto max-w-md text-sm text-muted">{description}</p>
    </div>
    {action}
  </Card>
);

