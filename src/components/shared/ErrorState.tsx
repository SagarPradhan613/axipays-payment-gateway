import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@components/ui';

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const ErrorState = ({ title, description, action }: ErrorStateProps) => (
  <Card className="flex flex-col items-center justify-center gap-4 border-red-200 py-12 text-center dark:border-red-900/30">
    <div className="rounded-full bg-red-50 p-4 text-danger dark:bg-red-900/20">
      <AlertTriangle className="h-6 w-6" />
    </div>
    <div className="space-y-2">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto max-w-md text-sm text-muted">{description}</p>
    </div>
    {action}
  </Card>
);

