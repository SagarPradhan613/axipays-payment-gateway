import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@components/ui';
import { usePageTitle } from '@hooks';

/**
 * Renders a simple 404 page with a guided path back to checkout.
 */
export const NotFoundPage = () => {
  const { t } = useTranslation();

  usePageTitle(t('common:notFound.metaTitle'));

  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <Card className="w-full max-w-xl space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-100">
          <Compass className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            404
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">{t('common:notFound.title')}</h1>
          <p className="text-sm leading-7 text-muted">{t('common:notFound.description')}</p>
        </div>
        <div className="flex justify-center">
          <Link to="/checkout">
            <Button>{t('common:notFound.backToCheckout')}</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
