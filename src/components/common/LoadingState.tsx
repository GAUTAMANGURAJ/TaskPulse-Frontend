import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingStateProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  tip = 'Loading data...',
  size = 'large',
  minHeight = '320px',
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 36 : 24 }} spin />;

  return (
    <div
      className="flex flex-col items-center justify-center w-full gap-3"
      style={{ minHeight }}
    >
      <Spin indicator={antIcon} />
      <p className="text-sm font-medium text-theme-muted animate-pulse">
        {tip}
      </p>
    </div>
  );
};
