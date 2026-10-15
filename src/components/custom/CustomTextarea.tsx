import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CustomLabel } from './CustomLabel';

export interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  isRequired?: boolean;
  tooltip?: string | React.ReactNode;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
  containerClassName?: string;
}

/**
 * TaskPulse Enterprise - Standardized Textarea Component
 * Provides integrated label, character count display, auto-resize styling, and error handling.
 */
export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({
  label,
  subLabel,
  isRequired = false,
  tooltip,
  error,
  helperText,
  showCount = false,
  maxLength,
  value,
  containerClassName,
  className,
  disabled,
  rows = 3,
  ...props
}, ref) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
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

      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={twMerge(
            clsx(
              'input-enterprise resize-none',
              hasError && 'border-[var(--status-error-dot)] focus:ring-[var(--status-error-border)]',
              disabled && 'opacity-60 cursor-not-allowed bg-[var(--bg-surface-subtle)]',
              className
            )
          )}
          {...props}
        />

        {showCount && maxLength && (
          <div className="text-right mt-1">
            <span className="text-[11px] font-mono text-theme-muted">
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
      </div>

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
});

CustomTextarea.displayName = 'CustomTextarea';
