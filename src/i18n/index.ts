import I18n from 'i18n-js';
import translations from './translations';

(I18n as any).translations = translations;
(I18n as any).defaultLocale = 'en';
(I18n as any).locale = 'en';

export const setLanguage = (locale: 'en' | 'pt') => {
  (I18n as any).locale = locale;
};

export const t = (key: string) => (I18n as any).t(key);

export default I18n;
