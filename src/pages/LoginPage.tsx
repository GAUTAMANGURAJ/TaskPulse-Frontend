import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltFilled, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { LoginFormData } from '@/schemas/auth';

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const { mode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm<LoginFormData>();
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (values: LoginFormData) => {
    setFormError(null);
    const success = await login(values);
    if (success) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  const fillQuickCredentials = (email: string) => {
    form.setFieldsValue({
      email,
      password: 'password123',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 text-white mb-4">
            <ThunderboltFilled className="text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            TaskPulse Enterprise
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unified Workflow & RBAC Administration Suite
          </p>
        </div>

        {/* Login Card */}
        <Card
          variant="borderless"
          className="shadow-2xl rounded-2xl border border-slate-800"
          style={{
            background: mode === 'dark' ? '#111827' : '#ffffff',
          }}
          styles={{ body: { padding: '32px 28px' } }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Account Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your corporate credentials to access the console
            </p>
          </div>

          {formError && (
            <Alert
              message={formError}
              type="error"
              showIcon
              closable
              onClose={() => setFormError(null)}
              className="mb-5 text-xs"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Email</span>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400 mr-1" />}
                placeholder="admin@example.com"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</span>}
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400 mr-1" />}
                placeholder="••••••••"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mt-6 mb-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                className="bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-600/30 rounded-lg h-11"
              >
                Sign In to Console
              </Button>
            </Form.Item>
          </Form>

          <Divider plain className="my-5 text-slate-400 text-[11px]">
            Quick Test Accounts
          </Divider>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin@example.com')}
              className="px-2.5 py-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 transition-all cursor-pointer"
            >
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                Super Admin
              </p>
              <p className="text-[10px] text-slate-400 truncate">admin@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('user@example.com')}
              className="px-2.5 py-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 transition-all cursor-pointer"
            >
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Standard User
              </p>
              <p className="text-[10px] text-slate-400 truncate">user@example.com</p>
            </button>
          </div>

          <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <SafetyCertificateOutlined className="text-emerald-500" />
            <span>Protected by JWT & Bcrypt Cryptography</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
