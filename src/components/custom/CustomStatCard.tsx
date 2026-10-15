import React from 'react';
import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export interface CustomStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const CustomStatCard: React.FC<CustomStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'surface-subtle',
  iconColor = 'text-theme-accent',
  trend,
  className = '',
}) => {
  return (
    <Card
      variant="borderless"
      className={`card-enterprise subtle-lift relative overflow-hidden group ${className}`}
      styles={{ body: { padding: '16px 18px' } }}
    >
      {/* Top subtle gradient highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-theme-muted m-0">
            {title}
          </p>
          <div
            className="text-lg sm:text-xl font-bold tracking-tight text-theme-title"
          >
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-theme-body font-medium m-0">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                  trend.isPositive
                    ? 'badge-pill-success'
                    : 'badge-pill-danger'
                }`}
              >
                {trend.isPositive ? <ArrowUpOutlined className="text-[9px]" /> : <ArrowDownOutlined className="text-[9px]" />}
                {trend.value}
              </span>
              <span className="text-[10.5px] text-theme-muted">vs prev</span>
            </div>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor} ${iconColor} text-lg shadow-xs transition-transform duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
