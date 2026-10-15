import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { LocaleCode, LocaleInfo, TranslationsSchema } from './types';
import { en } from './locales/en';
import { es } from './locales/es';
import { storage } from '../utils/storage';

const LOCALES: Record<LocaleCode, TranslationsSchema> = { en, es };

export const AVAILABLE_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', direction: 'ltr' },
  { code: 'es', name: 'Español (ES)', flag: '🇪🇸', direction: 'ltr' },
];

interface I18nContextType {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  availableLocales: LocaleInfo[];
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const saved = storage.getLanguage();
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
    const navLang = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en';
    return navLang === 'es' ? 'es' : 'en';
  });

  const setLocale = (code: LocaleCode) => {
    setLocaleState(code);
    storage.setLanguage(code);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => {
    return (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      let current: unknown = LOCALES[locale];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = (current as Record<string, unknown>)[k];
        } else {
          // Fallback to English if translation is missing in the current locale
          let fallback: unknown = LOCALES.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = (fallback as Record<string, unknown>)[fbKey];
            } else {
              return keyPath; // If completely missing, return key path
            }
          }
          current = fallback;
          break;
        }
      }

      if (typeof current !== 'string') {
        return keyPath;
      }

      let text = current;
      if (params) {
        for (const [paramKey, paramVal] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        }
      }

      return text;
    };
  }, [locale]);

  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return String(date);
    }
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch {
      return String(value);
    }
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        availableLocales: AVAILABLE_LOCALES,
        t,
        formatDate,
        formatNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
