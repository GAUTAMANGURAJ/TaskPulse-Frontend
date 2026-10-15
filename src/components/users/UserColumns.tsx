import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Tooltip, Switch } from 'antd';
import { EditOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import { CustomActionMenu } from '../custom/CustomActionMenu';
import { getInternalUserActionMenu } from '../../constants/userListData';
import type { User } from '@/types/user';

export interface UserColumnActions {
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onToggleStatus: (user: User) => void;
  currentUserId?: number;
  isStatusPending?: boolean;
  statusPendingId?: number | null;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number) => string;
}

export const getUserColumns = (actions: UserColumnActions): ColumnsType<User> => [
  {
    title: actions.t('common.id'),
    dataIndex: 'id',
    key: 'id',
    width: 75,
    render: (id: number) => <span className="font-mono text-xs font-semibold text-theme-muted">#{id}</span>,
  },
  {
    title: actions.t('tableHeaders.internalUsers.nameAndEmail'),
    dataIndex: 'email',
    key: 'email',
    render: (email: string, record: User) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full avatar-badge-collaborator flex items-center justify-center text-xs font-black shrink-0">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm truncate text-theme-title">
              {email}
            </span>
            {record.id === actions.currentUserId && (
              <span className="badge-current-session inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold">
                {actions.t('common.currentSession')}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: actions.t('tableHeaders.internalUsers.roles'),
    key: 'role',
    width: 170,
    render: (_, record: User) => (
      <div className="flex flex-col">
        <span className="font-semibold text-xs text-theme-title">
          {record.role_name || (record.is_superuser ? 'Super Admin' : 'Standard User')}
        </span>
        {record.is_superuser && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-accent">
            SuperAdmin
          </span>
        )}
      </div>
    ),
  },
  {
    title: actions.t('tableHeaders.internalUsers.status'),
    dataIndex: 'is_active',
    key: 'is_active',
    width: 130,
    render: (isActive: boolean) => (
      <CustomStatusBadge type="user_status" value={isActive} />
    ),
  },
  {
    title: actions.t('users.activeAccess'),
    key: 'toggle',
    width: 140,
    render: (_, record: User) => {
      const isSelf = record.id === actions.currentUserId;
      return (
        <Tooltip
          title={
            isSelf
              ? actions.t('users.cannotDeactivateSelf')
              : actions.t('users.activeAccess')
          }
        >
          <div className="flex items-center gap-2">
            <Switch
              checked={record.is_active}
              disabled={isSelf}
              onChange={() => actions.onToggleStatus(record)}
              loading={actions.isStatusPending && actions.statusPendingId === record.id}
            />
            <span className="text-xs text-theme-muted font-medium">
              {record.is_active ? actions.t('users.active') : actions.t('users.inactive')}
            </span>
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: actions.t('tableHeaders.internalUsers.createdAt'),
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    render: (date: string) => (
      <span className="text-xs text-theme-body font-medium">
        {actions.formatDate(date)}
      </span>
    ),
  },
  {
    title: actions.t('tableHeaders.internalUsers.actions'),
    key: 'actions',
    width: 90,
    align: 'center',
    render: (_, record: User) => {
      const menuConfig = getInternalUserActionMenu(record, actions.t, actions.currentUserId);
      const actionItems = [
        {
          key: 'view',
          label: actions.t('common.view'),
          icon: <EyeOutlined className="text-theme-muted" />,
          onClick: () => actions.onView(record),
        },
        ...menuConfig.map((item) => {
          let icon = <EditOutlined className="text-theme-accent" />;
          let onClick = () => {};

          if (item.value === 'edit') {
            icon = <EditOutlined className="text-theme-accent" />;
            onClick = () => actions.onEdit(record);
          } else if (item.value === 'suspend') {
            icon = <StopOutlined className="text-theme-inactive" />;
            onClick = () => actions.onToggleStatus(record);
          } else if (item.value === 'reactivate') {
            icon = <CheckCircleOutlined className="text-theme-active" />;
            onClick = () => actions.onToggleStatus(record);
          }

          return {
            key: item.key,
            label: item.label,
            icon,
            disabled: item.disabled,
            onClick,
          };
        }),
      ];

      return <CustomActionMenu items={actionItems} />;
    },
  },
];
