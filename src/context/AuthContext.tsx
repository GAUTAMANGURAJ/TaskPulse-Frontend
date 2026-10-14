import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchMyProfile, loginRequest, AUTH_QUERY_KEYS } from '../api/auth';
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
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const loadUserProfile = async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchMyProfile();
      setUser(profile);
    } catch {
      // Token might be invalid or expired
      storage.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      storage.setToken(response.access_token);

      const profile = await fetchMyProfile();
      setUser(profile);
      queryClient.setQueryData(AUTH_QUERY_KEYS.ME, profile);

      showSuccessToast(
        'Authentication Successful',
        `Welcome to TaskPulse Enterprise, ${profile.email}!`
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

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    queryClient.clear();
    showSuccessToast('Logged Out', 'You have been safely signed out.');
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
