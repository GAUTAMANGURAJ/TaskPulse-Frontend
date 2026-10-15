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
            <p className="text-base font-semibold text-theme-title">
              {title}
            </p>
            <p className="text-xs text-theme-muted max-w-sm">
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
            className="mt-2 btn-primary"
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};
