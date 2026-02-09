import { I18n } from 'i18n-js';
import translations from './translations';

const i18n = new I18n(translations);

i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;

export const setLanguage = (locale: 'en' | 'pt') => {
  i18n.locale = locale;
};

export const t = (key: string, options?: any) => i18n.t(key, options);

export default i18n;

