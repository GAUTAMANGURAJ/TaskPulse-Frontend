import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CustomLabel } from './CustomLabel';

export interface CustomSelectOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface CustomSelectProps extends Omit<SelectProps, 'options'> {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  isRequired?: boolean;
  tooltip?: string | React.ReactNode;
  error?: string;
  options: CustomSelectOption[];
  helperText?: string;
  containerClassName?: string;
}

/**
 * TaskPulse Enterprise - Standardized Form Select Component
 * Bundles label, validation error feedback, accessibility, and Ant Design Select.
 * Eliminates repetitive Form.Item and manual label/error markup in forms.
 */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  subLabel,
  isRequired = false,
  tooltip,
  error,
  options,
  helperText,
  containerClassName,
  className,
  status,
  ...selectProps
}) => {
  const hasError = Boolean(error);

  return (
    <div className={twMerge('w-full space-y-1.5', containerClassName)}>
      {label && (
        <CustomLabel
          labelName={label}
          subLabelName={subLabel}
          isRequired={isRequired}
          tooltip={tooltip}
          error={error}
        />
      )}

      <Select
        options={options}
        status={hasError ? 'error' : status}
        className={twMerge(
          clsx(
            'w-full enterprise-select',
            hasError && 'has-select-error',
            className
          )
        )}
        {...selectProps}
      />

      {error ? (
        <p className="text-xs text-theme-inactive font-medium animate-scale-in">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-theme-muted font-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
