import { MoonStar, SunMedium } from 'lucide-react';
import { Button } from '@components/ui';
import { useThemeStore } from '@store';
import { useTranslation } from 'react-i18next';

export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      aria-label={t('common:actions.toggleTheme')}
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="rounded-none border-b-2 border-transparent px-1 text-sm font-semibold text-muted hover:bg-transparent hover:text-ink"
    >
      {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
};
