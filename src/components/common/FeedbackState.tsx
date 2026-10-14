import React from 'react';
import { Result, Button, Spin, Empty } from 'antd';
import { LoadingOutlined, ReloadOutlined, StopOutlined, FilterOutlined } from '@ant-design/icons';

export interface FeedbackStateProps {
  status: 'loading' | 'empty' | 'filtered_empty' | 'error' | 'forbidden';
  title?: string;
  description?: string;
  onRetry?: () => void;
  onResetFilters?: () => void;
  actionText?: string;
  onAction?: () => void;
  minHeight?: string;
}

/**
 * Enterprise FeedbackState component implementing Pirai feedback-states contract.
 * Explicitly distinguishes loading, refreshing, empty, filtered-empty, error, and forbidden states.
 */
export const FeedbackState: React.FC<FeedbackStateProps> = ({
  status,
  title,
  description,
  onRetry,
  onResetFilters,
  actionText,
  onAction,
  minHeight = '300px',
}) => {
  if (status === 'loading') {
    const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
    return (
      <div
        className="flex flex-col items-center justify-center w-full gap-3"
        style={{ minHeight }}
      >
        <Spin indicator={antIcon} />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {title || 'Loading data...'}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-8 flex items-center justify-center" style={{ minHeight }}>
        <Result
          status="error"
          title={<span className="text-lg font-bold">{title || 'Data Request Failed'}</span>}
          subTitle={
            <span className="text-slate-500 text-xs max-w-md block">
              {description ||
                'Unable to communicate with the enterprise service. Please verify network status or retry.'}
            </span>
          }
          extra={
            onRetry && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={onRetry}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Retry Request
              </Button>
            )
          }
        />
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="py-8 flex items-center justify-center" style={{ minHeight }}>
        <Result
          status="403"
          icon={<StopOutlined className="text-4xl text-rose-500" />}
          title={<span className="text-lg font-bold">{title || 'Access Prohibited'}</span>}
          subTitle={
            <span className="text-slate-500 text-xs">
              {description || 'Your account does not possess the required RBAC authority for this resource.'}
            </span>
          }
        />
      </div>
    );
  }

  if (status === 'filtered_empty') {
    return (
      <div className="py-12 px-4 flex flex-col items-center justify-center" style={{ minHeight }}>
        <Empty
          image={<FilterOutlined className="text-4xl text-slate-300" />}
          description={
            <div className="space-y-1 mt-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {title || 'No Matching Records'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {description || 'Adjust your search term or clear the active status filter.'}
              </p>
            </div>
          }
        >
          {onResetFilters && (
            <Button onClick={onResetFilters} className="mt-2 text-xs">
              Reset Filters
            </Button>
          )}
        </Empty>
      </div>
    );
  }

  // True Empty
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center" style={{ minHeight }}>
      <Empty
        description={
          <div className="space-y-1 mt-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {title || 'No Records Found'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {description || 'There are currently no items available in this view.'}
            </p>
          </div>
        }
      >
        {actionText && onAction && (
          <Button
            type="primary"
            onClick={onAction}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};
