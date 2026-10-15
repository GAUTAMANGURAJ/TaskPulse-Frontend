import React, { useState } from 'react';
import { Card, Descriptions, Form, Input } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  ThunderboltFilled,
  KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useUpdateUser } from '../api/users';
import {
  CustomStatusBadge,
  CustomButton,
  CustomLabel,
  CustomPageHeader,
  CustomCard,
} from '../components/custom';
import { showSuccessToast } from '../utils/toast';
import { useI18n } from '../i18n/I18nContext';

export const ProfilePage: React.FC = () => {
  const { user, isSuperAdmin, refreshProfile } = useAuth();
  const { t, formatDate } = useI18n();
  const updateUser = useUpdateUser();
  const [form] = Form.useForm();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const handlePasswordSubmit = async (values: { password: string }) => {
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { password: values.password },
      });
      form.resetFields();
      setIsChangingPassword(false);
      showSuccessToast(t('profile.securityUpdatedTitle'), t('profile.securityUpdatedDesc'));
      await refreshProfile();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <CustomPageHeader
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
      />

      {/* User Hero Banner */}
      <Card
        variant="borderless"
        className="card-enterprise shadow-sm overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="h-32 bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 relative">
          <div className="absolute top-4 right-4 text-white/10 pointer-events-none">
            <ThunderboltFilled className="text-7xl" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl surface-card p-1.5 shadow-2xl shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white font-black text-3xl flex items-center justify-center shadow-inner">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-theme-title">
                  {user.email}
                </h2>
                <CustomStatusBadge type="user_role" value={user.is_superuser} />
              </div>
              <p className="text-xs text-theme-muted font-medium">
                {t('profile.userIdLabel')}: <span className="font-mono font-bold text-theme-accent">#{user.id}</span>
              </p>
            </div>
          </div>

          <div className="mb-1">
            <CustomStatusBadge type="user_status" value={user.is_active} />
          </div>
        </div>
      </Card>

      {/* Account Details & Audit Trail */}
      <CustomCard
        title={<span className="font-bold text-base text-theme-title">{t('profile.accountDetails')}</span>}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
          <Descriptions.Item label={t('users.emailAddress')}>
            <div className="flex items-center gap-2">
              <MailOutlined className="text-theme-muted" />
              <span className="font-semibold text-theme-body">{user.email}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={t('profile.roleLevel')}>
            {isSuperAdmin ? (
              <span className="badge-pill badge-pill-role-admin">
                {t('auth.superAdmin')}
              </span>
            ) : (
              <span className="badge-pill badge-pill-role-user">
                {t('auth.standardUser')}
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('users.registeredOn')}>
            <div className="flex items-center gap-2 text-xs text-theme-body">
              <CalendarOutlined className="text-theme-muted" />
              <span>{formatDate(user.created_at, { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={t('profile.lastUpdated')}>
            <div className="flex items-center gap-2 text-xs text-theme-body">
              <CalendarOutlined className="text-theme-muted" />
              <span>{formatDate(user.updated_at, { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </CustomCard>

      {/* Security & Password Card */}
      <CustomCard
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-theme-active" />
            <span className="font-bold text-base text-theme-title">{t('profile.securitySettings')}</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl surface-subtle">
            <div>
              <p className="font-bold text-sm text-theme-title flex items-center gap-2">
                <KeyOutlined className="text-theme-accent" /> {t('profile.changePassword')}
              </p>
              <p className="text-xs text-theme-muted mt-0.5">
                {t('profile.securityBcryptNotice')}
              </p>
            </div>
            <CustomButton
              variant={isChangingPassword ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? t('common.cancel') : t('profile.changePassword')}
            </CustomButton>
          </div>

          {isChangingPassword && (
            <div className="p-5 rounded-xl border border-theme-divider surface-subtle animate-scale-in">
              <h4 className="text-sm font-bold text-theme-title mb-3">
                {t('profile.changePassword')}
              </h4>
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePasswordSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="password"
                  label={
                    <CustomLabel
                      labelName={t('profile.newPassword')}
                      isRequired
                      tooltip={t('profile.passwordTooltip')}
                    />
                  }
                  rules={[
                    { required: true, message: t('profile.passwordRequired') },
                    { min: 6, message: t('profile.passwordMinLength') },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-theme-muted mr-1" />}
                    placeholder={t('profile.passwordPlaceholder')}
                    size="large"
                    className="rounded-lg max-w-md"
                  />
                </Form.Item>

                <CustomButton
                  type="submit"
                  variant="primary"
                  loading={updateUser.isPending}
                >
                  {t('profile.savePassword')}
                </CustomButton>
              </Form>
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );
};
