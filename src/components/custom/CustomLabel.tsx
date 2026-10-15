import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomLabelProps {
  labelName: string | React.ReactNode;
  subLabelName?: string | React.ReactNode;
  labelFor?: string;
  isRequired?: boolean;
  tooltip?: string | React.ReactNode;
  badge?: React.ReactNode;
  error?: string;
  className?: string;
}

export const CustomLabel: React.FC<CustomLabelProps> = ({
  labelName,
  subLabelName,
  labelFor,
  isRequired = false,
  tooltip,
  badge,
  error,
  className,
}) => {
  return (
    <div className={twMerge('flex items-center justify-between gap-2 mb-1.5', className)}>
      <label
        htmlFor={labelFor}
        className={clsx(
          'text-xs font-semibold select-none flex items-center gap-1.5 transition-colors',
          error ? 'text-theme-inactive' : 'text-theme-title'
        )}
      >
        <span>{labelName}</span>

        {isRequired && (
          <span className="text-theme-inactive font-bold ml-0.5" aria-hidden="true">
            *
          </span>
        )}

        {subLabelName && (
          <span className="text-[11px] font-normal text-theme-muted ml-1">
            {subLabelName}
          </span>
        )}

        {tooltip && (
          <Tooltip title={tooltip} placement="top">
            <InfoCircleOutlined className="text-[11px] text-theme-muted hover:text-theme-accent cursor-help transition-colors" />
          </Tooltip>
        )}
      </label>

      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
};
