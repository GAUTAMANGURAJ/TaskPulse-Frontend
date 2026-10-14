import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  UserOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, user } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined className="text-base" />,
      label: 'Dashboard',
    },
    {
      key: '/todos',
      icon: <CheckSquareOutlined className="text-base" />,
      label: 'Task Governance',
    },
    ...(isSuperAdmin
      ? [
          {
            key: '/users',
            icon: <TeamOutlined className="text-base" />,
            label: 'User Management',
          },
        ]
      : []),
    {
      key: '/profile',
      icon: <UserOutlined className="text-base" />,
      label: 'My Account',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      theme="dark"
      className="border-r border-slate-800 shadow-xl z-20 min-h-screen"
      style={{
        background: '#0f172a',
      }}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-800/80 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
          <ThunderboltFilled className="text-xl" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-base text-white tracking-wide truncate">
              TaskPulse
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400">
              Enterprise Suite
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
          className="border-none bg-transparent font-medium"
        />
      </div>

      {/* User Status Footer in Sidebar */}
      {!collapsed && user && (
        <div className="absolute bottom-16 left-0 right-0 p-4 border-t border-slate-800/60 mx-2">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {user.email}
              </span>
              <span className="text-[10px] text-indigo-400 font-medium">
                {user.is_superuser ? 'Super Administrator' : 'Standard User'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Sider>
  );
};
