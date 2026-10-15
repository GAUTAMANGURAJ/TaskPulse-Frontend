import React from 'react';
import { Layout, Button, Dropdown, Avatar, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
  CheckOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useUpdateUserPreferences } from '../../api/users';
import type { LocaleCode } from '../../i18n/types';
import type { ThemeMode } from '@/types/common';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { mode, resolvedMode, setMode } = useTheme();
  const { locale, setLocale, availableLocales, t } = useI18n();
  const navigate = useNavigate();
  const updatePreferences = useUpdateUserPreferences();

  // Handle Theme Mode Change: Instant UI response + API sync to backend
  const handleThemeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    if (user) {
      updatePreferences.mutate({
        theme_mode: newMode,
        language: locale,
      });
    }
  };

  // Handle Language Change: Instant UI response + API sync to backend
  const handleLanguageChange = (newLocale: LocaleCode) => {
    setLocale(newLocale);
    if (user) {
      updatePreferences.mutate({
        theme_mode: mode,
        language: newLocale,
      });
    }
  };

  // Language Menu Items
  const languageMenuItems: MenuProps['items'] = availableLocales.map((loc) => ({
    key: loc.code,
    label: (
      <div className="flex items-center justify-between gap-4 py-1 px-1">
        <span className="flex items-center gap-2.5">
          <span className="text-base">{loc.flag}</span>
          <span className="text-xs font-semibold text-theme-title">{loc.name}</span>
        </span>
        {locale === loc.code && <CheckOutlined className="text-theme-accent text-xs font-bold" />}
      </div>
    ),
    onClick: () => handleLanguageChange(loc.code as LocaleCode),
  }));

  // User Profile Menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1">
          <p className="text-xs font-semibold text-theme-title">
            {user?.email}
          </p>
          <div className="mt-1">
            {isSuperAdmin ? (
              <Tag color="purple" icon={<CrownOutlined />} className="text-[10px] m-0">
                {t('auth.superAdmin')}
              </Tag>
            ) : (
              <Tag color="blue" icon={<UserOutlined />} className="text-[10px] m-0">
                {t('auth.standardUser')}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-theme-inactive" />,
      danger: true,
      label: t('nav.logout'),
      onClick: logout,
    },
  ];

  return (
    <AntHeader className="header-enterprise px-6 flex items-center justify-between border-b transition-colors duration-200 sticky top-0 z-20 backdrop-blur-md shrink-0 select-none">
      {/* Left: Collapse Sidebar Button & Status Pill */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          aria-label={collapsed ? t('nav.expandMenu') : t('nav.collapseMenu')}
          className="text-base text-theme-body hover:text-theme-accent"
        />
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full badge-pill-success">
          <span className="w-2 h-2 rounded-full dot animate-pulse"></span>
          <span className="text-xs font-semibold text-theme-active">
            {t('nav.apiOnline')}
          </span>
        </div>
      </div>

      {/* Right: Theme Segmented Control, Language & User Account */}
      <div className="flex items-center gap-3">
        {/* Modern Enterprise Theme Mode Switcher */}
        <div className="theme-segmented-group flex items-center p-1 rounded-xl transition-all duration-200">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'light'
                ? 'bg-[var(--bg-surface)] text-theme-accent shadow-sm font-bold scale-[1.02]'
                : 'text-theme-muted hover:text-theme-title'
            }`}
            aria-label={t('common.themeLight')}
          >
            <SunOutlined className={mode === 'light' ? 'text-theme-accent' : 'text-theme-muted'} />
            <span className="hidden lg:inline text-[11px]">{t('common.themeLight')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'dark'
                ? 'bg-[var(--bg-surface-elevated)] text-theme-accent shadow-sm font-bold scale-[1.02]'
                : 'text-theme-muted hover:text-theme-title'
            }`}
            aria-label={t('common.themeDark')}
          >
            <MoonOutlined className={mode === 'dark' ? 'text-theme-accent' : 'text-theme-muted'} />
            <span className="hidden lg:inline text-[11px]">{t('common.themeDark')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'system'
                ? 'bg-[var(--bg-surface)] text-theme-accent shadow-sm font-bold scale-[1.02]'
                : 'text-theme-muted hover:text-theme-title'
            }`}
            aria-label={t('common.themeSystem')}
          >
            <DesktopOutlined className={mode === 'system' ? 'text-theme-accent' : 'text-theme-muted'} />
            <span className="hidden lg:inline text-[11px]">{t('common.themeSystem')}</span>
          </button>
        </div>

        {/* Polished Language Selector */}
        <Dropdown menu={{ items: languageMenuItems }} trigger={['click']} placement="bottomRight">
          <button
            type="button"
            className="lang-selector-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs hover:border-theme-accent"
          >
            <span className="text-sm">{availableLocales.find((l) => l.code === locale)?.flag}</span>
            <span className="font-bold text-[11px] tracking-wide uppercase">{locale}</span>
            <DownOutlined className="text-[9px] text-theme-muted" />
          </button>
        </Dropdown>

        {/* User Account Menu */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <button className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors cursor-pointer border-none bg-transparent">
            <Avatar
              style={{
                backgroundColor: 'var(--primary-600)',
                verticalAlign: 'middle',
              }}
              icon={<UserOutlined />}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-theme-title">
                {user?.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-theme-muted font-medium">
                {isSuperAdmin ? t('auth.superAdmin') : t('auth.standardUser')}
              </span>
            </div>
          </button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
