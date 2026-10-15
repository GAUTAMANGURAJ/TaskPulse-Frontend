import { STORAGE_KEYS } from '../constants/endpoints';

/**
 * TaskPulse Enterprise Storage Manager
 * Strictly conforms to security standards:
 * Only stores:
 *   1. Access Token ('taskpulse_access_token')
 *   2. User ID ('taskpulse_user_id')
 *   3. Theme Mode ('taskpulse_theme_mode')
 *   4. Language ('taskpulse_language')
 * Actively purges any foreign or legacy keys (e.g. accessflow_*, client_*, user_data, roles).
 */

const ALLOWED_STORAGE_KEYS = new Set<string>([
  STORAGE_KEYS.ACCESS_TOKEN,
  STORAGE_KEYS.REFRESH_TOKEN,
  STORAGE_KEYS.USER_ID,
  STORAGE_KEYS.THEME_MODE,
  STORAGE_KEYS.LANGUAGE,
]);

/**
 * Scans localStorage and purges all non-allowed keys from previous sessions or foreign apps
 */
export const purgeLegacyStorage = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !ALLOWED_STORAGE_KEYS.has(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Storage purge warning:', e);
  }
};

// Immediate purge on script evaluation
purgeLegacyStorage();

export const storage = {
  // 1. Access Token
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to save access token in storage', e);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (e) {
      console.error('Failed to remove token from storage', e);
    }
  },

  // 1.1 Refresh Token
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to save refresh token in storage', e);
    }
  },

  removeRefreshToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (e) {
      console.error('Failed to remove refresh token from storage', e);
    }
  },

  // 2. User ID
  getUserId: (): number | null => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!val) return null;
      const parsed = parseInt(val, 10);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  },

  setUserId: (id: number | string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ID, String(id));
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to save user id in storage', e);
    }
  },

  removeUserId: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
    } catch (e) {
      console.error('Failed to remove user id from storage', e);
    }
  },

  // 3. Theme Mode
  getTheme: (): 'light' | 'dark' | 'system' => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (mode === 'dark' || mode === 'light' || mode === 'system') {
        return mode;
      }
      return 'system';
    } catch {
      return 'system';
    }
  },

  setTheme: (theme: 'light' | 'dark' | 'system'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to save theme in storage', e);
    }
  },

  // 4. Language
  getLanguage: (): 'en' | 'es' => {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (lang === 'en' || lang === 'es') {
        return lang;
      }
      return 'en';
    } catch {
      return 'en';
    }
  },

  setLanguage: (language: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to save language in storage', e);
    }
  },

  // Clear Auth State
  clearAuth: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      purgeLegacyStorage();
    } catch (e) {
      console.error('Failed to clear auth state', e);
    }
  },

  purgeLegacy: purgeLegacyStorage,
};
