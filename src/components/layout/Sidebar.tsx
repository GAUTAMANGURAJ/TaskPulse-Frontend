import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { usePermissionDataChecks } from '../../hooks/useUserPermissions';
import { MODULES } from '../../constants/modulesAndPermissions';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, user } = useAuth();
  const { checkModulePermission } = usePermissionDataChecks();
  const { t } = useI18n();

  const canAccessUsers = checkModulePermission(MODULES.USER_MANAGEMENT);
  const canAccessRoles = checkModulePermission(MODULES.ROLES_MANAGEMENT);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined className="text-base" />,
      label: collapsed ? (
        <Tooltip title={t('nav.dashboard')} placement="right">
          <span>{t('nav.dashboard')}</span>
        </Tooltip>
      ) : (
        t('nav.dashboard')
      ),
    },
    {
      key: '/todos',
      icon: <ReadOutlined className="text-base" />,
      label: collapsed ? (
        <Tooltip title={t('nav.tasks')} placement="right">
          <span>{t('nav.tasks')}</span>
        </Tooltip>
      ) : (
        t('nav.tasks')
      ),
    },
    ...(canAccessUsers
      ? [
          {
            key: '/users',
            icon: <TeamOutlined className="text-base" />,
            label: collapsed ? (
              <Tooltip title={t('nav.users')} placement="right">
                <span>{t('nav.users')}</span>
              </Tooltip>
            ) : (
              t('nav.users')
            ),
          },
        ]
      : []),
    ...(canAccessRoles
      ? [
          {
            key: '/roles',
            icon: <SafetyCertificateOutlined className="text-base" />,
            label: collapsed ? (
              <Tooltip title={t('nav.roles')} placement="right">
                <span>{t('nav.roles')}</span>
              </Tooltip>
            ) : (
              t('nav.roles')
            ),
          },
        ]
      : []),
    {
      key: '/profile',
      icon: <UserOutlined className="text-base" />,
      label: collapsed ? (
        <Tooltip title={t('nav.profile')} placement="right">
          <span>{t('nav.profile')}</span>
        </Tooltip>
      ) : (
        t('nav.profile')
      ),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      theme="dark"
      className="sidebar-enterprise shadow-2xl z-30 sticky top-0 h-screen select-none overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-[var(--sidebar-border)] overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
          <ThunderboltFilled className="text-xl" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-extrabold text-base text-white tracking-wide truncate">
              {t('auth.title')}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-theme-accent">
              {t('auth.subtitle')}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="py-4">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none bg-transparent font-semibold text-sm"
        />
      </div>

      {/* User Identity Card in Sidebar Bottom */}
      {!collapsed && user && (
        <div className="absolute bottom-16 left-0 right-0 p-3 mx-2">
          <div className="bg-[var(--sidebar-surface)] backdrop-blur-md rounded-xl p-3 border border-[var(--sidebar-border)] flex items-center gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[var(--sidebar-fg)] truncate">
                {user.email}
              </span>
              <span className="text-[10px] font-semibold text-theme-accent">
                {user.is_superuser ? t('auth.superAdmin') : t('auth.standardUser')}
              </span>
            </div>
          </div>
        </div>
      )}
    </Sider>
  );
};
