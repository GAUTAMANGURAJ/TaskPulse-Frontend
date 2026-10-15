import React from 'react';
import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';

export interface CustomDrawerProps extends DrawerProps {
  titleText?: string | React.ReactNode;
  subtitleText?: string | React.ReactNode;
  footerContent?: React.ReactNode;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  titleText,
  subtitleText,
  footerContent,
  children,
  width = 460,
  className,
  ...props
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={width}
      closable={false}
      destroyOnClose
      className={twMerge('enterprise-drawer', className)}
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
        mask: { backdropFilter: 'blur(3px)' },
      }}
      {...props}
    >
      <div className="flex flex-col h-full surface-card text-theme-title">
        {/* Custom Header */}
        <div className="px-5 py-3.5 border-b border-theme-divider flex items-center justify-between shrink-0 surface-subtle">
          <div className="min-w-0 pr-3">
            {titleText && (
              <h3 className="text-sm sm:text-base font-bold text-theme-title truncate m-0">
                {titleText}
              </h3>
            )}
            {subtitleText && (
              <p className="text-xs text-theme-muted mt-0.5 truncate m-0 font-normal">
                {subtitleText}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-muted hover:text-theme-title hover:bg-[var(--bg-hover)] transition-colors cursor-pointer shrink-0 border border-theme-divider"
            aria-label="Close drawer"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 hover-scrollbar">
          {children}
        </div>

        {/* Custom Footer */}
        {footerContent && (
          <div className="px-5 py-3 border-t border-theme-divider surface-subtle shrink-0 flex items-center justify-end gap-2">
            {footerContent}
          </div>
        )}
      </div>
    </Drawer>
  );
};
