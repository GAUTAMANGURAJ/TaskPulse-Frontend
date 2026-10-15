import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomPageHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * TaskPulse Enterprise - Standardized Page Header Component
 * Unifies title typography, icons, subtitles, and primary page actions.
 * Eliminates repetitive layout and divider boilerplates across screens.
 */
export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  badge,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 page-header-divider',
          className
        )
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-lg sm:text-xl font-bold text-theme-title tracking-tight flex items-center gap-2 m-0">
            <span>{title}</span>
            {icon && <span className="text-theme-accent text-lg flex items-center">{icon}</span>}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-xs text-theme-muted mt-0.5 leading-relaxed m-0 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
