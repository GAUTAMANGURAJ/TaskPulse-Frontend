import { STORAGE_KEYS } from '../constants/endpoints';

/**
 * Storage Helper
 * Provides safe typed access to localStorage
 */
export const storage = {
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

  clearAuth: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (e) {
      console.error('Failed to clear auth state', e);
    }
  },

  getTheme: (): 'light' | 'dark' => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return mode === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
    } catch (e) {
      console.error('Failed to save theme in storage', e);
    }
  },
};
