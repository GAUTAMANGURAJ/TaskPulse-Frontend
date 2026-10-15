import React from 'react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CustomSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  totalCount?: number;
  filteredCount?: number;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  totalCount,
  filteredCount,
  loading = false,
  className,
  inputClassName,
  autoFocus = false,
}) => {
  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  const showCount = typeof filteredCount === 'number' && typeof totalCount === 'number';

  return (
    <div className={twMerge('relative flex items-center w-full', className)}>
      <span className="absolute left-3.5 z-10 text-theme-muted pointer-events-none flex items-center text-sm">
        <SearchOutlined className={loading ? 'animate-pulse text-theme-accent' : ''} />
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          paddingLeft: '2.25rem',
          paddingRight: value || showCount ? '4.5rem' : '0.85rem',
        }}
        className={twMerge(
          clsx(
            'input-enterprise text-xs h-8.5',
            'transition-all duration-150',
            inputClassName
          )
        )}
      />

      <div className="absolute right-3 flex items-center gap-1.5 z-10">
        {showCount && (
          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded surface-subtle text-theme-body">
            {filteredCount}/{totalCount}
          </span>
        )}

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-theme-muted hover:text-theme-title transition-colors cursor-pointer flex items-center p-0.5"
            aria-label="Clear search"
          >
            <CloseCircleFilled className="text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};
