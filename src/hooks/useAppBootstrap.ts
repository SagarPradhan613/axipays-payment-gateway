import { useEffect } from 'react';
import i18n from '@/i18n';
import { useLanguageStore, useThemeStore } from '@store';

export const useAppBootstrap = () => {
  const theme = useThemeStore((state) => state.theme);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.lang = language;
  }, [language, theme]);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
};

