import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchMyProfile, loginRequest, logoutRequest, AUTH_QUERY_KEYS } from '../api/auth';
import { fetchUserById } from '../api/users';
import { storage } from '../utils/storage';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import type { User } from '@/types/user';
import type { LoginFormData } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Synchronize backend user preferences (theme & language) into storage and DOM
  const syncPreferencesFromUser = (profile: User) => {
    if (profile.theme_mode && (profile.theme_mode === 'light' || profile.theme_mode === 'dark' || profile.theme_mode === 'system')) {
      storage.setTheme(profile.theme_mode);
      const root = document.documentElement;
      const isDark =
        profile.theme_mode === 'dark' ||
        (profile.theme_mode === 'system' &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    if (profile.language && (profile.language === 'en' || profile.language === 'es')) {
      storage.setLanguage(profile.language);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = profile.language;
      }
    }
  };

  const loadUserProfile = async () => {
    const token = storage.getToken();
    const storedUserId = storage.getUserId();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Prioritize fetching by ID via GET /users/{id} as per endpoint contract
      let profile: User;
      if (storedUserId) {
        profile = await fetchUserById(storedUserId);
      } else {
        profile = await fetchMyProfile();
        if (profile?.id) {
          storage.setUserId(profile.id);
        }
      }

      setUser(profile);
      syncPreferencesFromUser(profile);
    } catch {
      // If profile fetch fails (e.g. token expired), attempt silent refresh if refresh_token is present
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch('/api/auth/refreshToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            storage.setToken(data.access_token);
            if (data.refresh_token) {
              storage.setRefreshToken(data.refresh_token);
            }
            // Retry profile loading with new token
            let retryProfile: User;
            if (storedUserId) {
              retryProfile = await fetchUserById(storedUserId);
            } else {
              retryProfile = await fetchMyProfile();
            }
            setUser(retryProfile);
            syncPreferencesFromUser(retryProfile);
            return;
          }
        } catch {
          // Token refresh failed
        }
      }

      // Token or user id invalid/expired and refresh failed
      storage.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Proactive Session Maintenance: background silent token refresh before expiration
  useEffect(() => {
    if (!user) return;

    const parseJwtExp = (token: string | null): number | null => {
      if (!token) return null;
      try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const decoded = JSON.parse(atob(payload));
        return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
      } catch {
        return null;
      }
    };

    const performSilentRefresh = async () => {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) return;
      try {
        const refreshRes = await fetch('/api/auth/refreshToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          storage.setToken(data.access_token);
          if (data.refresh_token) {
            storage.setRefreshToken(data.refresh_token);
          }
        }
      } catch (err) {
        console.warn('Background token refresh warning:', err);
      }
    };

    // Schedule refresh 2 minutes before token expires
    const scheduleNextRefresh = () => {
      const token = storage.getToken();
      const expTime = parseJwtExp(token);
      if (!expTime) return null;

      const timeUntilExp = expTime - Date.now();
      // Refresh 2 minutes before expiry, or immediately if less than 2 minutes left
      const delay = Math.max(10000, timeUntilExp - 2 * 60 * 1000);

      const timer = setTimeout(async () => {
        await performSilentRefresh();
        scheduleNextRefresh();
      }, delay);

      return timer;
    };

    const timerId = scheduleNextRefresh();

    // Check token freshness whenever user tabs back or focuses the window
    const handleVisibilityOrFocus = async () => {
      if (document.visibilityState === 'visible') {
        const token = storage.getToken();
        const expTime = parseJwtExp(token);
        if (expTime && expTime - Date.now() < 3 * 60 * 1000) {
          await performSilentRefresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [user]);

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      storage.setToken(response.access_token);
      if (response.refresh_token) {
        storage.setRefreshToken(response.refresh_token);
      }

      let profile: User;
      if (response.user_id) {
        storage.setUserId(response.user_id);
        profile = await fetchUserById(response.user_id);
      } else {
        profile = await fetchMyProfile();
        if (profile?.id) {
          storage.setUserId(profile.id);
        }
      }

      setUser(profile);
      syncPreferencesFromUser(profile);
      queryClient.setQueryData(AUTH_QUERY_KEYS.ME, profile);

      showSuccessToast(
        'Authentication Successful',
        `Welcome to PulseAI, ${profile.email}!`
      );
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      showErrorToast('Login Error', msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err: unknown) {
      console.warn('Backend logout request encountered an issue:', err);
    } finally {
      storage.clearAuth();
      setUser(null);
      queryClient.clear();
      showSuccessToast('Logged Out', 'You have been safely signed out.');
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  const isAuthenticated = Boolean(user && user.is_active);
  const isSuperAdmin = Boolean(user?.is_superuser);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSuperAdmin,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
