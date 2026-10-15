import React from 'react';
import { Card } from 'antd';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomControlBarProps {
  searchSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * TaskPulse Enterprise - Standardized Control & Filter Bar
 * Wraps search input, filter groups, and action controls in a responsive surface card.
 * Enforces unified spacing, border tokens, and responsive flex behavior.
 */
export const CustomControlBar: React.FC<CustomControlBarProps> = ({
  searchSlot,
  filterSlot,
  actionSlot,
  className,
  children,
}) => {
  return (
    <Card
      variant="borderless"
      className={twMerge('card-enterprise shadow-xs', className)}
      styles={{ body: { padding: '10px 14px' } }}
    >
      {children ? (
        children
      ) : (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {searchSlot && (
            <div className="flex-1 max-w-md w-full">
              {searchSlot}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end flex-1">
            {filterSlot && (
              <div className="flex items-center gap-2">
                {filterSlot}
              </div>
            )}
            {actionSlot && (
              <div className="flex items-center gap-2">
                {actionSlot}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
