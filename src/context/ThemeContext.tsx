import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { storage } from '../utils/storage';
import type { ThemeMode } from '@/types/common';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => storage.getTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.setTheme(mode);
  }, [mode]);

  const toggleTheme = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <ConfigProvider
        theme={{
          algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#4f46e5',
            colorInfo: '#4f46e5',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            borderRadius: 8,
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            colorBgBase: mode === 'dark' ? '#0f172a' : '#ffffff',
            colorBgContainer: mode === 'dark' ? '#1e293b' : '#ffffff',
            colorBorder: mode === 'dark' ? '#334155' : '#e2e8f0',
          },
          components: {
            Button: {
              controlHeight: 38,
              fontWeight: 600,
            },
            Table: {
              headerBg: mode === 'dark' ? '#1e293b' : '#f8fafc',
              headerColor: mode === 'dark' ? '#94a3b8' : '#475569',
              borderRadiusLG: 12,
            },
            Card: {
              colorBgContainer: mode === 'dark' ? '#1e293b' : '#ffffff',
            },
            Menu: {
              darkItemBg: '#0f172a',
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
