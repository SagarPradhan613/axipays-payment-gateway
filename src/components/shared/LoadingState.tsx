import { Card, Spinner } from '@components/ui';

interface LoadingStateProps {
  title: string;
  description?: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => (
  <Card className="flex flex-col items-center justify-center gap-4 py-12 text-center">
    <Spinner className="h-7 w-7" />
    <div className="space-y-2">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
    </div>
  </Card>
);

