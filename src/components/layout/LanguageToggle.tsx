import { Languages } from 'lucide-react';
import { Button } from '@components/ui';
import { useLanguageStore } from '@store';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const nextLanguage = language === 'en' ? 'hi' : 'en';

  return (
    <Button
      aria-label={t('common:actions.toggleLanguage')}
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(nextLanguage)}
      className="rounded-none border-b-2 border-transparent px-1 text-sm font-semibold text-muted hover:bg-transparent hover:text-ink"
    >
      <Languages className="h-4 w-4" />
      <span>{language === 'en' ? 'हिं' : 'EN'}</span>
    </Button>
  );
};
