import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SegmentedTabOption<T extends string = string> {
  label: string | React.ReactNode;
  value: T;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSegmentedTabsProps<T extends string = string> {
  options: SegmentedTabOption<NoInfer<T>>[];
  value: T;
  onChange: (value: NoInfer<T>) => void;
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

/**
 * TaskPulse Enterprise - Standardized Segmented Filter Tabs
 * Replaces repetitive inline Radio.Button groups with a clean, typed component.
 * Automatically displays option badges and item counts.
 */
export function CustomSegmentedTabs<T extends string = string>({
  options,
  value,
  onChange,
  size = 'middle',
  className,
}: CustomSegmentedTabsProps<T>): React.ReactElement {
  const handleChange = (e: RadioChangeEvent) => {
    onChange(e.target.value as T);
  };

  return (
    <div className={twMerge('inline-flex items-center', className)}>
      <Radio.Group
        value={value}
        onChange={handleChange}
        buttonStyle="solid"
        size={size}
        className="enterprise-segmented-radio"
      >
        {options.map((option) => (
          <Radio.Button
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={clsx(
              'font-semibold text-xs',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
              {typeof option.count === 'number' && (
                <span
                  className={clsx(
                    'text-xs font-semibold ml-1.5 tabular-nums transition-colors',
                    value === option.value
                      ? 'text-white/95 font-bold'
                      : 'text-theme-muted'
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
