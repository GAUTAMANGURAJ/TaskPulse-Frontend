import React from 'react';
import { Drawer, Descriptions, Tag, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import type { User } from '@/types/user';

interface UserDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  open,
  onClose,
  user,
  onEdit,
}) => {
  if (!user) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-indigo-600" />
          <span className="font-bold text-base">User Profile Overview</span>
        </div>
      }
      placement="right"
      width={460}
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            onClose();
            onEdit(user);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Edit Profile
        </Button>
      }
    >
      <div className="space-y-6">
        {/* User Card Header */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-xl shrink-0">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {user.email}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <CustomStatusBadge type="user_role" value={user.is_superuser} />
              <CustomStatusBadge type="user_status" value={user.is_active} />
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <Descriptions
          title={<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Audit Data</span>}
          column={1}
          bordered
          size="small"
        >
          <Descriptions.Item label="System ID">
            <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              #{user.id}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Email Address">
            <div className="flex items-center gap-1.5">
              <MailOutlined className="text-slate-400" />
              <span>{user.email}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="RBAC Access Level">
            {user.is_superuser ? (
              <span className="text-purple-600 font-semibold">
                Super Administrator (Full System Control)
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">
                Standard User (Task Management Access)
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Account Status">
            {user.is_active ? (
              <span className="text-emerald-600 font-semibold">Active & Permitted</span>
            ) : (
              <span className="text-rose-600 font-semibold">Suspended / Deactivated</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Created On">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <CalendarOutlined className="text-slate-400" />
              <span>{dayjs(user.created_at).format('MMM D, YYYY — h:mm:ss A')}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Last Updated">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <CalendarOutlined className="text-slate-400" />
              <span>{dayjs(user.updated_at).format('MMM D, YYYY — h:mm:ss A')}</span>
            </div>
          </Descriptions.Item>
        </Descriptions>

        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
          <SafetyCertificateOutlined className="text-indigo-600 text-lg mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Security & Compliance Integrity
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              All credentials are cryptographically protected using Bcrypt. Session tokens are digitally signed with short-lived JWT access tokens.
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
