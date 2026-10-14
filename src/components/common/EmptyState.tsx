import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
}) => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center">
      <Empty
        description={
          <div className="space-y-1 mt-2">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {description}
            </p>
          </div>
        }
      >
        {actionText && onAction && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAction}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700"
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};
