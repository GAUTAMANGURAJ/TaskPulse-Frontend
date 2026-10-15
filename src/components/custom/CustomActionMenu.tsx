import React, { useState, useMemo, useCallback } from 'react';
import { Dropdown, Tooltip, Popconfirm, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ActionMenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  tooltip?: string;
  confirm?: {
    title: string;
    description?: string;
    okText?: string;
    cancelText?: string;
  };
  onClick?: () => void;
}

export interface CustomActionMenuProps {
  items: ActionMenuItem[];
  mode?: 'dropdown' | 'inline';
  triggerIcon?: React.ReactNode;
  triggerVariant?: 'circle' | 'button' | 'text';
  triggerLabel?: string;
  size?: 'small' | 'middle';
  placement?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  className?: string;
  ariaLabel?: string;
}

export const CustomActionMenu: React.FC<CustomActionMenuProps> = React.memo(({
  items,
  mode = 'dropdown',
  triggerIcon = <MoreOutlined className="text-base" />,
  triggerVariant = 'circle',
  triggerLabel,
  size = 'small',
  placement = 'bottomRight',
  className,
  ariaLabel = 'Action menu',
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  // Dropdown items definition with strict event handling to prevent double trigger / double render
  const menuItems = useMemo<MenuProps['items']>(() => {
    return items.map((item) => {
      if (item.confirm) {
        return {
          key: item.key,
          icon: item.icon ? <span className="text-sm">{item.icon}</span> : undefined,
          danger: item.danger,
          disabled: item.disabled,
          label: (
            <Popconfirm
              title={item.confirm.title}
              description={item.confirm.description}
              onConfirm={(e) => {
                e?.stopPropagation();
                setOpen(false);
                item.onClick?.();
              }}
              onCancel={(e) => {
                e?.stopPropagation();
                setOpen(false);
              }}
              okText={item.confirm.okText || 'Confirm'}
              cancelText={item.confirm.cancelText || 'Cancel'}
              okButtonProps={{ danger: item.danger }}
              icon={<ExclamationCircleFilled className={item.danger ? 'text-theme-inactive' : 'text-theme-accent'} />}
            >
              <div
                className="w-full text-xs font-medium py-0.5 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {item.label}
              </div>
            </Popconfirm>
          ),
        };
      }

      return {
        key: item.key,
        icon: item.icon ? <span className="text-sm">{item.icon}</span> : undefined,
        danger: item.danger,
        disabled: item.disabled,
        label: <span className="text-xs font-medium select-none">{item.label}</span>,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          setOpen(false);
          item.onClick?.();
        },
      };
    });
  }, [items]);

  // Inline Mode: Render actions side by side with tooltips and Popconfirm
  if (mode === 'inline') {
    return (
      <Space size={6} className={twMerge('inline-flex items-center', className)}>
        {items.map((item) => {
          if (item.confirm) {
            return (
              <Popconfirm
                key={item.key}
                title={item.confirm.title}
                description={item.confirm.description}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  item.onClick?.();
                }}
                onCancel={(e) => e?.stopPropagation()}
                okText={item.confirm.okText || 'Confirm'}
                cancelText={item.confirm.cancelText || 'Cancel'}
                okButtonProps={{ danger: item.danger }}
                icon={<ExclamationCircleFilled className={item.danger ? 'text-theme-inactive' : 'text-theme-accent'} />}
              >
                <Tooltip title={item.tooltip || (typeof item.label === 'string' ? item.label : undefined)}>
                  <Button
                    type="text"
                    shape="circle"
                    size={size}
                    disabled={item.disabled}
                    danger={item.danger}
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      'transition-all duration-150 flex items-center justify-center',
                      item.danger
                        ? 'text-theme-inactive opacity-80 hover:opacity-100'
                        : 'text-theme-muted hover:text-theme-accent hover:bg-[var(--bg-hover)]'
                    )}
                    aria-label={typeof item.label === 'string' ? item.label : item.key}
                  >
                    {item.icon}
                  </Button>
                </Tooltip>
              </Popconfirm>
            );
          }

          const buttonElement = (
            <Button
              type="text"
              shape="circle"
              size={size}
              disabled={item.disabled}
              danger={item.danger}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
              }}
              className={clsx(
                'transition-all duration-150 flex items-center justify-center',
                item.danger
                  ? 'text-theme-inactive opacity-80 hover:opacity-100'
                  : 'text-theme-muted hover:text-theme-accent hover:bg-[var(--bg-hover)]'
              )}
              aria-label={typeof item.label === 'string' ? item.label : item.key}
            >
              {item.icon}
            </Button>
          );

          if (item.tooltip || typeof item.label === 'string') {
            return (
              <Tooltip key={item.key} title={item.tooltip || item.label}>
                {buttonElement}
              </Tooltip>
            );
          }

          return <React.Fragment key={item.key}>{buttonElement}</React.Fragment>;
        })}
      </Space>
    );
  }

  // Dropdown Mode: 3-dots trigger button opening a floating menu
  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      menu={{
        items: menuItems,
      }}
      trigger={['click']}
      placement={placement}
      destroyPopupOnHide
      overlayClassName="custom-action-dropdown-overlay"
    >
      <Button
        type={triggerVariant === 'button' ? 'default' : 'text'}
        shape={triggerVariant === 'circle' ? 'circle' : undefined}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={twMerge(
          clsx(
            'flex items-center justify-center transition-all duration-150',
            triggerVariant === 'circle'
              ? 'w-8 h-8 rounded-lg text-theme-muted hover:text-theme-title hover:bg-[var(--bg-hover)]'
              : 'gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg',
            className
          )
        )}
        aria-label={ariaLabel}
      >
        {triggerIcon}
        {triggerLabel && <span>{triggerLabel}</span>}
      </Button>
    </Dropdown>
  );
});

CustomActionMenu.displayName = 'CustomActionMenu';

