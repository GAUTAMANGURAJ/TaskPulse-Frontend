import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  block?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'start',
  block = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 h-7.5 gap-1.5 rounded-lg',
    md: 'text-xs px-3 py-1.5 h-8.5 gap-2 rounded-lg font-medium',
    lg: 'text-sm px-4 py-2 h-9.5 gap-2 rounded-xl font-semibold',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    success: 'btn-success',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          'btn-enterprise',
          variantClasses[variant],
          sizeClasses[size],
          block && 'w-full',
          (disabled || loading) && 'opacity-60 cursor-not-allowed hover:transform-none shadow-none',
          className
        )
      )}
      {...props}
    >
      {loading ? (
        <LoadingOutlined className="animate-spin text-base" />
      ) : (
        icon && iconPosition === 'start' && <span className="inline-flex items-center">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'end' && (
        <span className="inline-flex items-center">{icon}</span>
      )}
    </button>
  );
};
