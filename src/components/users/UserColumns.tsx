import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Space, Button, Tooltip, Switch } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import type { User } from '@/types/user';

export interface UserColumnActions {
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onToggleStatus: (user: User) => void;
  currentUserId?: number;
  isStatusPending?: boolean;
  statusPendingId?: number | null;
}

export const getUserColumns = (actions: UserColumnActions): ColumnsType<User> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 75,
    render: (id: number) => <span className="font-mono text-xs text-slate-400">#{id}</span>,
  },
  {
    title: 'User Email',
    dataIndex: 'email',
    key: 'email',
    render: (email: string, record: User) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            {email}
          </span>
          {record.id === actions.currentUserId && (
            <span className="text-[10px] text-indigo-500 font-bold">
              (Your Account)
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    title: 'RBAC Role',
    dataIndex: 'is_superuser',
    key: 'is_superuser',
    width: 140,
    render: (isSuperuser: boolean) => (
      <CustomStatusBadge type="user_role" value={isSuperuser} />
    ),
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    width: 120,
    render: (isActive: boolean) => (
      <CustomStatusBadge type="user_status" value={isActive} />
    ),
  },
  {
    title: 'Active Access',
    key: 'toggle',
    width: 140,
    render: (_, record: User) => {
      const isSelf = record.id === actions.currentUserId;
      return (
        <Tooltip
          title={
            isSelf
              ? 'Super Administrators cannot deactivate their own session'
              : 'Toggle active access'
          }
        >
          <div className="flex items-center gap-2">
            <Switch
              checked={record.is_active}
              disabled={isSelf}
              onChange={() => actions.onToggleStatus(record)}
              loading={actions.isStatusPending && actions.statusPendingId === record.id}
              className={record.is_active ? 'bg-emerald-500' : ''}
            />
            <span className="text-xs text-slate-400">
              {record.is_active ? 'Active' : 'Locked'}
            </span>
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: 'Registered On',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    render: (date: string) => (
      <span className="text-xs text-slate-500">
        {dayjs(date).format('MMM D, YYYY')}
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 110,
    render: (_, record: User) => (
      <Space size="small">
        <Tooltip title="View full audit profile">
          <Button
            type="text"
            icon={<EyeOutlined className="text-slate-500 hover:text-indigo-600" />}
            onClick={() => actions.onView(record)}
          />
        </Tooltip>
        <Tooltip title="Edit user settings">
          <Button
            type="text"
            icon={<EditOutlined className="text-slate-500 hover:text-indigo-600" />}
            onClick={() => actions.onEdit(record)}
          />
        </Tooltip>
      </Space>
    ),
  },
];
