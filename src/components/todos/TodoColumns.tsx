import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import { CustomActionMenu } from '../custom/CustomActionMenu';
import type { TodoItem } from '@/types/todo';

export interface TodoColumnActions {
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  isStatusPending?: boolean;
  statusPendingId?: number | null;
  isDeletePending?: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const getTodoColumns = (actions: TodoColumnActions): ColumnsType<TodoItem> => [
  {
    title: actions.t('common.id'),
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (id: number) => <span className="font-mono text-xs font-semibold text-theme-muted">#{id}</span>,
  },
  {
    title: actions.t('tasks.taskDetails'),
    key: 'title',
    render: (_, record: TodoItem) => (
      <div className="space-y-1">
        <span
          className={`font-semibold text-sm transition-colors ${
            record.is_complete
              ? 'line-through text-theme-muted'
              : 'text-theme-title'
          }`}
        >
          {record.title}
        </span>
        {record.description && (
          <p className="text-xs text-theme-body line-clamp-2 max-w-xl">
            {record.description}
          </p>
        )}
      </div>
    ),
  },
  {
    title: actions.t('common.status'),
    dataIndex: 'is_complete',
    key: 'is_complete',
    width: 140,
    render: (isComplete: boolean) => (
      <CustomStatusBadge type="todo_status" value={isComplete} />
    ),
  },
  {
    title: actions.t('tasks.taskStatus'),
    key: 'toggle',
    width: 160,
    render: (_, record: TodoItem) => (
      <div className="flex items-center gap-2.5">
        <Switch
          checked={record.is_complete}
          onChange={() => actions.onToggleStatus(record.id, record.is_complete)}
          loading={actions.isStatusPending && actions.statusPendingId === record.id}
        />
        <span className="text-xs text-theme-body font-medium">
          {record.is_complete ? actions.t('tasks.completed') : actions.t('tasks.inProgress')}
        </span>
      </div>
    ),
  },
  {
    title: actions.t('common.actions'),
    key: 'actions',
    width: 90,
    align: 'center',
    render: (_, record: TodoItem) => (
      <CustomActionMenu
        items={[
          {
            key: 'edit',
            label: actions.t('common.edit'),
            icon: <EditOutlined className="text-theme-accent" />,
            onClick: () => actions.onEdit(record),
          },
          {
            key: 'delete',
            label: actions.t('common.delete'),
            icon: <DeleteOutlined className="text-theme-inactive" />,
            danger: true,
            confirm: {
              title: actions.t('tasks.deleteTask'),
              description: actions.t('tasks.deleteConfirm'),
              okText: actions.t('tasks.confirmDelete'),
              cancelText: actions.t('tasks.cancel'),
            },
            onClick: () => actions.onDelete(record.id),
          },
        ]}
      />
    ),
  },
];
