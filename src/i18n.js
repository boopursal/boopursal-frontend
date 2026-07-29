import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  fr: {
    translation: translationFR
  },
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  },
  es: {
    translation: translationES
  }
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

// Language change handler - always keep LTR layout
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
  // Always keep LTR direction regardless of language
  document.documentElement.setAttribute('dir', 'ltr');
  document.body.classList.remove('rtl');
});

export default i18n; // force reload 5
