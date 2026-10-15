import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomDropdownProps {
  items: MenuProps['items'];
  trigger?: ('click' | 'hover')[];
  placement?: 'bottomLeft' | 'bottomRight' | 'topRight' | 'topLeft';
  children?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  trigger = ['click'],
  placement = 'bottomLeft',
  children,
  label,
  icon,
  className,
}) => {
  return (
    <Dropdown
      menu={{ items }}
      trigger={trigger}
      placement={placement}
      overlayClassName="animate-scale-in"
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          className={twMerge(
            clsx(
              'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg',
              'surface-card border border-theme-divider',
              'text-theme-title hover:border-theme-accent transition-all cursor-pointer',
              className
            )
          )}
        >
          {icon && <span>{icon}</span>}
          {label && <span>{label}</span>}
          <DownOutlined className="text-[10px] text-theme-muted" />
        </button>
      )}
    </Dropdown>
  );
};
