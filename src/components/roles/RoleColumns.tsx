import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Switch, Tooltip } from 'antd';
import {
  SafetyCertificateOutlined,
  EditOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { CustomActionMenu } from '../custom/CustomActionMenu';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import { getRolesActionMenu } from '../../constants/roles';
import type { Role } from '../../types/role';

export interface RoleColumnActions {
  onEdit: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
  isStatusPending?: boolean;
  statusPendingId?: number | null;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number) => string;
}

/**
 * Roles Table Columns
 * Conforms to Robolab table column specifications:
 * 1. Action (Ellipsis Menu)
 * 2. Role Name & Description
 * 3. Permission Count
 * 4. Status (Active/Inactive Toggle + Badge)
 * 5. Created At
 */
export const getRoleColumns = (actions: RoleColumnActions): ColumnsType<Role> => [
  {
    title: actions.t('tableHeaders.roles.action'),
    key: 'action',
    width: 70,
    align: 'center',
    render: (_, record: Role) => {
      const menuConfig = getRolesActionMenu(record, actions.t);
      const actionItems = menuConfig.map((item) => {
        let icon = <EditOutlined className="text-theme-accent" />;
        let onClick = () => {};

        if (item.value === 'assign') {
          icon = <SafetyCertificateOutlined className="text-theme-accent" />;
          onClick = () => actions.onManagePermissions(record);
        } else if (item.value === 'edit') {
          icon = <EditOutlined className="text-theme-accent" />;
          onClick = () => actions.onEdit(record);
        } else if (item.value === 'deactivate') {
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
      });

      return <CustomActionMenu items={actionItems} />;
    },
  },
  {
    title: actions.t('tableHeaders.roles.roleName'),
    dataIndex: 'name',
    key: 'roleName',
    render: (name: string, record: Role) => (
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-sm text-theme-title truncate">
          {name}
        </span>
        <span className="text-xs text-theme-muted line-clamp-1">
          {record.description || actions.t('roles.noDescription')}
        </span>
      </div>
    ),
  },
  {
    title: actions.t('tableHeaders.roles.permission'),
    dataIndex: 'permission_count',
    key: 'permission',
    width: 170,
    render: (count: number) => (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11.5px] font-semibold badge-pill-info">
        <KeyOutlined />
        <span>{count || 0} permissions</span>
      </span>
    ),
  },
  {
    title: actions.t('tableHeaders.roles.status'),
    dataIndex: 'is_active',
    key: 'status',
    width: 180,
    render: (isActive: boolean, record: Role) => {
      const isSuperAdminRole = record.id === 1;
      return (
        <div className="flex items-center gap-2.5">
          <Tooltip
            title={
              isSuperAdminRole
                ? actions.t('roles.cannotDisableSuperAdmin')
                : actions.t('roles.toggleStatusTooltip')
            }
          >
            <Switch
              checked={isActive}
              disabled={isSuperAdminRole}
              onChange={() => actions.onToggleStatus(record)}
              loading={actions.isStatusPending && actions.statusPendingId === record.id}
            />
          </Tooltip>
          <CustomStatusBadge type="user_status" value={isActive} />
        </div>
      );
    },
  },
  {
    title: actions.t('tableHeaders.roles.createdAt'),
    dataIndex: 'created_at',
    key: 'createdAt',
    width: 160,
    render: (date: string) => (
      <span className="text-xs text-theme-body font-medium">
        {actions.formatDate(date)}
      </span>
    ),
  },
];
