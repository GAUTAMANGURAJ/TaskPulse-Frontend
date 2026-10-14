import React from 'react';
import { Layout, Button, Dropdown, Avatar, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {user?.email}
          </p>
          <div className="mt-1">
            {isSuperAdmin ? (
              <Tag color="purple" icon={<CrownOutlined />} className="text-[10px] m-0">
                Super Admin
              </Tag>
            ) : (
              <Tag color="blue" icon={<UserOutlined />} className="text-[10px] m-0">
                Standard User
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
      label: 'My Profile & Account',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-rose-500" />,
      danger: true,
      label: 'Sign Out',
      onClick: logout,
    },
  ];

  return (
    <AntHeader
      className="px-6 flex items-center justify-between border-b transition-colors duration-200 sticky top-0 z-10"
      style={{
        background: mode === 'dark' ? '#111827' : '#ffffff',
        borderColor: mode === 'dark' ? '#1f2937' : '#f1f5f9',
        height: 64,
        lineHeight: '64px',
      }}
    >
      {/* Left: Collapse Button & System Tag */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="text-base text-slate-600 dark:text-slate-300 hover:text-indigo-600"
        />
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Enterprise API Online
          </span>
        </div>
      </div>

      {/* Right: Theme Toggle & User Menu */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          shape="circle"
          icon={mode === 'dark' ? <BulbFilled className="text-amber-400" /> : <BulbOutlined />}
          onClick={toggleTheme}
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-slate-600 dark:text-slate-300 hover:text-indigo-600"
        />

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent">
            <Avatar
              style={{
                backgroundColor: isSuperAdmin ? '#7c3aed' : '#4f46e5',
                verticalAlign: 'middle',
              }}
              icon={<UserOutlined />}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-slate-400">
                {isSuperAdmin ? 'Super Admin' : 'Member'}
              </span>
            </div>
          </button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
