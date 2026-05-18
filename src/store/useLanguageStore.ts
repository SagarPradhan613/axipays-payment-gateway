import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'en' | 'hi';

interface LanguageStore {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'axipays-language',
    },
  ),
);

