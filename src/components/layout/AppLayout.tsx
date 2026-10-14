import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

const { Content } = Layout;

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="flex flex-col min-h-screen">
        <Header collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
        <Content className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto transition-all">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
