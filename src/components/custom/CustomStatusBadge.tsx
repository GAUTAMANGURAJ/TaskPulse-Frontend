import React from 'react';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  UserOutlined,
  CrownFilled,
  StopFilled,
} from '@ant-design/icons';
import { useI18n } from '../../i18n/I18nContext';

export interface CustomStatusBadgeProps {
  type: 'todo_status' | 'user_status' | 'user_role';
  value: boolean;
  text?: string;
  className?: string;
}

export const CustomStatusBadge: React.FC<CustomStatusBadgeProps> = ({
  type,
  value,
  text,
  className = '',
}) => {
  const { t } = useI18n();

  if (type === 'todo_status') {
    return value ? (
      <span className={`badge-pill badge-pill-success ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full dot animate-pulse-dot" />
        <CheckCircleFilled className="text-[11px]" />
        <span>{text || t('tasks.completed')}</span>
      </span>
    ) : (
      <span className={`badge-pill badge-pill-warning ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full dot animate-pulse-dot" />
        <ClockCircleFilled className="text-[11px]" />
        <span>{text || t('tasks.inProgress')}</span>
      </span>
    );
  }

  if (type === 'user_status') {
    return value ? (
      <span className={`badge-pill badge-pill-success ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full dot animate-pulse-dot" />
        <span>{text || t('users.active')}</span>
      </span>
    ) : (
      <span className={`badge-pill badge-pill-error ${className}`}>
        <StopFilled className="text-[10px]" />
        <span>{text || t('users.inactive')}</span>
      </span>
    );
  }

  if (type === 'user_role') {
    return value ? (
      <span className={`badge-pill badge-pill-role-admin ${className}`}>
        <CrownFilled className="text-[11px]" />
        <span>{text || t('auth.superAdmin')}</span>
      </span>
    ) : (
      <span className={`badge-pill badge-pill-role-user ${className}`}>
        <UserOutlined className="text-[11px]" />
        <span>{text || t('auth.standardUser')}</span>
      </span>
    );
  }

  return null;
};
