import React, { useState, forwardRef } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { CustomLabel } from './CustomLabel';

export interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  isRequired?: boolean;
  tooltip?: string | React.ReactNode;
  error?: string;
  prefix?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isPassword?: boolean;
  size?: 'small' | 'middle' | 'large';
  clearable?: boolean;
  onClear?: () => void;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({
  label,
  subLabel,
  isRequired = false,
  tooltip,
  error,
  prefix,
  prefixIcon,
  suffix,
  suffixIcon,
  isPassword = false,
  size = 'middle',
  clearable = false,
  onClear,
  type = 'text',
  className,
  value,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const effectivePrefix = prefix || prefixIcon;
  const effectiveSuffix = suffix || suffixIcon;
  const isPasswordField = isPassword || type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const hasTrailing = Boolean(effectiveSuffix || isPasswordField || (clearable && value));

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <CustomLabel
          labelName={label}
          subLabelName={subLabel}
          isRequired={isRequired}
          tooltip={tooltip}
          error={error}
        />
      )}
      <div className="relative flex items-center">
        {effectivePrefix && (
          <span className="absolute left-3.5 z-10 text-theme-muted pointer-events-none flex items-center justify-center text-sm">
            {effectivePrefix}
          </span>
        )}
        <input
          ref={ref}
          type={effectiveType}
          disabled={disabled}
          value={value}
          style={{
            paddingLeft: effectivePrefix ? '2.35rem' : undefined,
            paddingRight: hasTrailing ? '2.35rem' : undefined,
            ...props.style,
          }}
          className={twMerge(
            clsx(
              'input-enterprise',
              size === 'small' && 'py-1 text-xs h-7.5',
              size === 'middle' && 'py-1.5 text-xs h-8.5',
              size === 'large' && 'py-2 text-sm h-10',
              effectivePrefix && 'has-prefix !pl-9',
              hasTrailing && 'has-suffix !pr-9',
              error && 'border-[var(--status-error-dot)] focus:ring-[var(--status-error-border)]',
              disabled && 'opacity-60 cursor-not-allowed bg-[var(--bg-surface-subtle)]',
              className
            )
          )}
          {...props}
        />
        <div className="absolute right-3 flex items-center gap-1.5 text-theme-muted">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="text-theme-muted hover:text-theme-title transition-colors cursor-pointer"
            >
              <CloseCircleFilled className="text-xs" />
            </button>
          )}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          )}
          {effectiveSuffix && <span>{effectiveSuffix}</span>}
        </div>
      </div>
      {error && (
        <p className="text-xs text-theme-inactive font-medium animate-scale-in">
          {error}
        </p>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';
