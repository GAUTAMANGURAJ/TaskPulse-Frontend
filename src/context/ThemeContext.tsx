import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { storage } from '../utils/storage';
import type { ThemeMode } from '@/types/common';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => storage.getTheme());
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to OS system color changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.setTheme(mode);
  }, [mode, resolvedMode]);

  const toggleTheme = () => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      return next;
    });
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const isDark = resolvedMode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, toggleTheme, setMode }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#4f46e5',
            colorInfo: '#4f46e5',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            fontSize: 13,
            fontSizeSM: 12,
            fontSizeLG: 14,
            fontSizeXL: 16,
            controlHeight: 34,
            controlHeightSM: 28,
            controlHeightLG: 38,
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            colorBgBase: isDark ? '#060911' : '#f8fafc',
            colorBgContainer: isDark ? '#0e1526' : '#ffffff',
            colorBgElevated: isDark ? '#161f36' : '#ffffff',
            colorBorder: isDark ? '#1e293b' : '#e2e8f0',
            colorBorderSecondary: isDark ? '#162035' : '#f1f5f9',
            colorText: isDark ? '#f8fafc' : '#0f172a',
            colorTextSecondary: isDark ? '#94a3b8' : '#475569',
          },
          components: {
            Button: {
              controlHeight: 34,
              fontWeight: 500,
              borderRadius: 8,
            },
            Input: {
              controlHeight: 34,
              borderRadius: 8,
            },
            Select: {
              controlHeight: 34,
              borderRadius: 8,
            },
            Table: {
              headerBg: isDark ? '#111a2e' : '#f1f5f9',
              headerColor: isDark ? '#94a3b8' : '#475569',
              borderRadiusLG: 12,
              borderColor: isDark ? '#1e293b' : '#e2e8f0',
              rowHoverBg: isDark ? '#162038' : '#f8fafc',
              fontSize: 12.5,
            },
            Card: {
              colorBgContainer: isDark ? '#0e1526' : '#ffffff',
              borderRadiusLG: 12,
            },
            Modal: {
              contentBg: isDark ? '#0e1526' : '#ffffff',
              headerBg: isDark ? '#0e1526' : '#ffffff',
              borderRadiusLG: 14,
            },
            Drawer: {
              colorBgElevated: isDark ? '#0e1526' : '#ffffff',
            },
            Dropdown: {
              colorBgElevated: isDark ? '#161f36' : '#ffffff',
              borderRadiusLG: 10,
            },
            Menu: {
              darkItemBg: '#090e1a',
              darkItemSelectedBg: '#4f46e5',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
