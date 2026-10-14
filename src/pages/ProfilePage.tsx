import React, { useState } from 'react';
import { Card, Descriptions, Button, Tag, Divider, Form, Input } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  ThunderboltFilled,
  KeyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { useUpdateUser } from '../api/users';
import { CustomStatusBadge } from '../components/custom/CustomStatusBadge';
import { showSuccessToast } from '../utils/toast';

export const ProfilePage: React.FC = () => {
  const { user, isSuperAdmin, refreshProfile } = useAuth();
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
      showSuccessToast('Security Updated', 'Your password has been securely updated.');
      await refreshProfile();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Security
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your personal credentials, RBAC privileges, and enterprise security policies
        </p>
      </div>

      {/* User Hero Banner */}
      <Card
        variant="borderless"
        className="shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="h-28 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 relative">
          <div className="absolute top-4 right-4 text-white/20">
            <ThunderboltFilled className="text-6xl" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 p-1.5 shadow-xl shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-3xl flex items-center justify-center">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.email}
                </h2>
                <CustomStatusBadge type="user_role" value={user.is_superuser} />
              </div>
              <p className="text-xs text-slate-500">
                User ID: <span className="font-mono font-semibold">#{user.id}</span>
              </p>
            </div>
          </div>

          <div className="mb-1">
            <CustomStatusBadge type="user_status" value={user.is_active} />
          </div>
        </div>
      </Card>

      {/* Account Details & Audit Trail */}
      <Card
        title={<span className="font-bold text-base">Profile Specifications</span>}
        className="shadow-sm border border-slate-200/80 dark:border-slate-800"
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
          <Descriptions.Item label="Email Account">
            <div className="flex items-center gap-2">
              <MailOutlined className="text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{user.email}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Authorization Level">
            {isSuperAdmin ? (
              <Tag color="purple" className="font-semibold">
                Super Administrator
              </Tag>
            ) : (
              <Tag color="blue" className="font-medium">
                Standard User
              </Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Member Since">
            <div className="flex items-center gap-2 text-xs">
              <CalendarOutlined className="text-slate-400" />
              <span>{dayjs(user.created_at).format('MMMM D, YYYY — h:mm A')}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Last Profile Audit">
            <div className="flex items-center gap-2 text-xs">
              <CalendarOutlined className="text-slate-400" />
              <span>{dayjs(user.updated_at).format('MMMM D, YYYY — h:mm A')}</span>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Security & Password Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-emerald-500" />
            <span className="font-bold text-base">Security & Credential Management</span>
          </div>
        }
        className="shadow-sm border border-slate-200/80 dark:border-slate-800"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <KeyOutlined className="text-indigo-600" /> Password Authentication
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stored as a salted Bcrypt hash with constant-time verification.
              </p>
            </div>
            <Button
              type={isChangingPassword ? 'default' : 'primary'}
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className={!isChangingPassword ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {isChangingPassword && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                Update Account Password
              </h4>
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePasswordSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="password"
                  label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</span>}
                  rules={[
                    { required: true, message: 'Please enter a new password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400 mr-1" />}
                    placeholder="Enter at least 6 characters"
                    size="large"
                    className="rounded-lg max-w-md"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateUser.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Password
                </Button>
              </Form>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
