import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '@locales';

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'checkout', 'dashboard'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;

