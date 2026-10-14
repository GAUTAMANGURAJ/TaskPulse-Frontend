import React from 'react';
import { Card } from 'antd';

interface CustomStatCardProps {
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
}

export const CustomStatCard: React.FC<CustomStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/40',
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  trend,
}) => {
  return (
    <Card
      variant="borderless"
      className="shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 dark:border-slate-800"
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-[11px] text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor} ${iconColor} text-xl shadow-xs`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
