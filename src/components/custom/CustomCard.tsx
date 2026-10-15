import React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomCardProps extends Omit<CardProps, 'title'> {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bodyClassName?: string;
}

/**
 * TaskPulse Enterprise - Standardized Container Card
 * Unifies card elevation, border tokens, header layout, and padding standards.
 */
export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  icon,
  headerAction,
  padding = 'md',
  bodyClassName,
  className,
  children,
  ...cardProps
}) => {
  const paddingMap = {
    none: '0px',
    sm: '10px 14px',
    md: '14px 18px',
    lg: '20px 24px',
  };

  const hasHeader = Boolean(title || subtitle || icon || headerAction);

  return (
    <Card
      variant="borderless"
      className={twMerge('card-enterprise shadow-xs overflow-hidden', className)}
      classNames={{ body: bodyClassName }}
      styles={{ body: { padding: paddingMap[padding] }, ...cardProps.styles }}
      title={
        hasHeader ? (
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="min-w-0 flex items-center gap-2">
              {icon && <span className="text-theme-accent text-base flex items-center">{icon}</span>}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-theme-title truncate m-0">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-theme-muted font-normal mt-0.5 truncate m-0">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        ) : null
      }
      {...cardProps}
    >
      {children}
    </Card>
  );
};
