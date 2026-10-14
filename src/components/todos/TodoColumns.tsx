import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Space, Button, Tooltip, Popconfirm, Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import type { TodoItem } from '@/types/todo';

export interface TodoColumnActions {
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  isStatusPending?: boolean;
  statusPendingId?: number | null;
  isDeletePending?: boolean;
}

export const getTodoColumns = (actions: TodoColumnActions): ColumnsType<TodoItem> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (id: number) => <span className="font-mono text-xs text-slate-400">#{id}</span>,
  },
  {
    title: 'Task & Details',
    key: 'title',
    render: (_, record: TodoItem) => (
      <div className="space-y-1">
        <span
          className={`font-semibold text-sm ${
            record.is_complete
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {record.title}
        </span>
        {record.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xl">
            {record.description}
          </p>
        )}
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'is_complete',
    key: 'is_complete',
    width: 140,
    render: (isComplete: boolean) => (
      <CustomStatusBadge type="todo_status" value={isComplete} />
    ),
  },
  {
    title: 'Completion Toggle',
    key: 'toggle',
    width: 160,
    render: (_, record: TodoItem) => (
      <div className="flex items-center gap-2">
        <Switch
          checked={record.is_complete}
          onChange={() => actions.onToggleStatus(record.id, record.is_complete)}
          loading={actions.isStatusPending && actions.statusPendingId === record.id}
          className={record.is_complete ? 'bg-emerald-500' : ''}
        />
        <span className="text-xs text-slate-500 font-medium">
          {record.is_complete ? 'Done' : 'Pending'}
        </span>
      </div>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render: (_, record: TodoItem) => (
      <Space size="small">
        <Tooltip title="Edit task details">
          <Button
            type="text"
            icon={<EditOutlined className="text-slate-500 hover:text-indigo-600" />}
            onClick={() => actions.onEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Permanently delete">
          <Popconfirm
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            onConfirm={() => actions.onDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: actions.isDeletePending }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined className="hover:text-rose-600" />}
            />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];
