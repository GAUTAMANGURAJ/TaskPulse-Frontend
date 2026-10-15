import React from 'react';
import { Descriptions } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { CustomStatusBadge } from '../custom/CustomStatusBadge';
import { CustomButton } from '../custom/CustomButton';
import { CustomDrawer } from '../custom/CustomDrawer';
import { useI18n } from '../../i18n/I18nContext';
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
  const { t, formatDate } = useI18n();

  if (!user) return null;

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      titleText={t('users.userDetail')}
      subtitleText={`Collaborator #${user.id} • ${user.email}`}
      width={480}
      footerContent={
        <>
          <CustomButton variant="secondary" size="md" onClick={onClose}>
            {t('common.close')}
          </CustomButton>
          <CustomButton
            variant="primary"
            size="md"
            icon={<EditOutlined />}
            onClick={() => {
              onClose();
              onEdit(user);
            }}
          >
            {t('common.edit')}
          </CustomButton>
        </>
      }
    >
      <div className="space-y-6">
        {/* User Card Header */}
        <div className="p-4 rounded-xl surface-subtle flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl avatar-badge-collaborator font-black flex items-center justify-center text-xl shrink-0">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-base text-theme-title truncate">
              {user.email}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <CustomStatusBadge type="user_role" value={user.is_superuser} />
              <CustomStatusBadge type="user_status" value={user.is_active} />
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <Descriptions
          title={<span className="text-xs font-bold uppercase tracking-wider text-theme-muted">{t('users.auditData')}</span>}
          column={1}
          bordered
          size="small"
        >
          <Descriptions.Item label={t('users.systemId')}>
            <span className="font-mono text-xs text-theme-accent font-bold">
              #{user.id}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label={t('users.emailAddress')}>
            <div className="flex items-center gap-1.5">
              <MailOutlined className="text-theme-muted" />
              <span className="text-theme-body">{user.email}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={t('users.role')}>
            {user.is_superuser ? (
              <span className="text-theme-admin font-bold">
                {t('auth.superAdmin')} ({t('users.fullPrivileges')})
              </span>
            ) : (
              <span className="text-theme-body font-medium">
                {t('auth.standardUser')}
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('users.status')}>
            {user.is_active ? (
              <span className="text-theme-active font-semibold">
                {t('users.active')} ({t('users.authorized')})
              </span>
            ) : (
              <span className="text-theme-inactive font-semibold">
                {t('users.inactive')} ({t('users.revoked')})
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('users.registeredOn')}>
            <div className="flex items-center gap-1.5">
              <CalendarOutlined className="text-theme-muted" />
              <span className="text-theme-body">{formatDate(user.created_at)}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={t('users.clearanceType')}>
            <div className="flex items-center gap-1.5">
              <SafetyCertificateOutlined className="text-theme-accent" />
              <span className="text-xs font-mono text-theme-body">{t('users.authType')}</span>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </CustomDrawer>
  );
};
