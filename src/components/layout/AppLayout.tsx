import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const { Content } = Layout;

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout
      className="h-screen w-full overflow-hidden select-none"
      style={{ background: 'var(--bg-canvas)' }}
    >
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        className="flex flex-col h-full min-w-0 flex-1 overflow-hidden transition-colors duration-200"
        style={{ background: 'var(--bg-canvas)' }}
      >
        <Header collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
        <Content className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 w-full p-5 sm:p-7 md:p-8 transition-all hover-scrollbar">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
