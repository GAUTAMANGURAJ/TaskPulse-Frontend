import React, { useState } from 'react';
import { Form, Alert, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ThunderboltFilled,
  SafetyCertificateFilled,
  GlobalOutlined,
  CheckOutlined,
  BranchesOutlined,
  CheckCircleFilled,
  BulbFilled,
  DatabaseFilled,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import type { LocaleCode } from '../i18n/types';
import type { LoginFormData } from '@/schemas/auth';
import { CustomButton } from '../components/custom/CustomButton';
import { CustomInput } from '../components/custom/CustomInput';
import { CustomLabel } from '../components/custom/CustomLabel';

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const { resolvedMode } = useTheme();
  const { locale, setLocale, availableLocales, t } = useI18n();
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
    } else {
      setFormError(t('auth.invalidCredentials'));
    }
  };

  const fillQuickCredentials = (email: string, password: string) => {
    form.setFieldsValue({
      email,
      password,
    });
    setFormError(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 relative overflow-hidden select-none">
      {/* =========================================================================
          BACKGROUND AMBIENT ANIMATIONS & GRID MESH
          ========================================================================= */}
      <div className="absolute inset-0 bg-grid-mesh opacity-40 pointer-events-none" />

      {/* Dynamic Floating Radiant Orbs */}
      <div className="absolute -top-32 -left-32 w-120 h-120 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none animate-float-1" />
      <div className="absolute -bottom-40 left-1/4 w-120 h-120 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-float-2" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Floating Particle Accents */}
      <div className="absolute top-20 left-1/3 w-2 h-2 rounded-full bg-indigo-400 opacity-60 animate-ping" />
      <div className="absolute bottom-32 left-1/6 w-1.5 h-1.5 rounded-full bg-violet-400 opacity-50 animate-pulse" />
      <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-40 animate-pulse" />

      {/* Language Switcher in top right */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl">
          <GlobalOutlined className="text-slate-400 ml-2" />
          {availableLocales.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setLocale(loc.code as LocaleCode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                locale === loc.code
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{loc.flag}</span> <span className="uppercase">{loc.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          LEFT SIDE: FULL-STACK AI KNOWLEDGE ASSISTANT SHOWCASE
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-[56%] xl:w-[58%] flex-col justify-between p-12 xl:p-16 relative z-10">
        {/* Brand Top Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse-glow">
            <ThunderboltFilled className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black text-white tracking-tight">{t('auth.title')}</span>
              <span className="text-[10px] tracking-wider uppercase font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t('auth.subtitle')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="text-[11px] font-semibold text-emerald-400/90 tracking-wide">
                {t('auth.engineStatus')}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Visual Area & Dynamic Animated Cards */}
        <div className="my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <BulbFilled className="text-indigo-400" />
            <span>{t('auth.heroBadge')}</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {t('auth.heroTitle1')} <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              {t('auth.heroTitle2')}
            </span>
          </h2>

          <p className="text-sm xl:text-base text-slate-400 font-normal leading-relaxed mb-8">
            {t('auth.heroDesc')}
          </p>

          {/* Interactive Floating Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            {/* Card 1: Semantic Knowledge Retrieval */}
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-xl animate-float-slow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-lg">
                  <BulbFilled />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <CheckCircleFilled className="text-[10px]" /> {t('auth.feature1Badge')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">{t('auth.feature1Title')}</h3>
              <p className="text-xs text-slate-400 mt-1">{t('auth.feature1Desc')}</p>
            </div>

            {/* Card 2: Knowledge Ingestion Velocity */}
            <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-violet-500/40 transition-all duration-300 shadow-xl animate-float-reverse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center text-lg">
                  <DatabaseFilled />
                </div>
                <span className="text-[11px] font-extrabold text-violet-300">{t('auth.feature2Badge')}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">{t('auth.feature2Title')}</h3>
              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full w-[96%]" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{t('auth.feature2Desc')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="flex items-center gap-6 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{t('auth.bottomBadge1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>{t('auth.bottomBadge2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{t('auth.bottomBadge3')}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: AUTHENTICATION FORM CARD
          ========================================================================= */}
      <div className="w-full lg:w-[44%] xl:w-[42%] flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile-only Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 text-white mb-3">
              <ThunderboltFilled className="text-2xl" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t('auth.title')}
            </h1>
            <p className="text-xs text-indigo-300/80 font-medium mt-1">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Form Card */}
          <div className="auth-form-card rounded-2xl p-7 sm:p-8 transition-all">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {t('auth.signInTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('auth.signInSubtitle')}
              </p>
            </div>

            {formError && (
              <Alert
                message={formError}
                type="error"
                showIcon
                closable
                onClose={() => setFormError(null)}
                className="mb-5 text-xs font-medium rounded-lg"
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
                label={
                  <CustomLabel
                    labelName={t('auth.emailLabel')}
                    isRequired
                    tooltip={t('auth.emailTooltip')}
                  />
                }
                rules={[
                  { required: true, message: t('auth.emailValidation') },
                  { type: 'email', message: t('auth.emailFormatValidation') },
                ]}
                className="mb-4"
              >
                <CustomInput
                  prefixIcon={<UserOutlined />}
                  placeholder={t('auth.emailPlaceholder')}
                  clearable
                  onClear={() => form.setFieldsValue({ email: '' })}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <CustomLabel
                    labelName={t('auth.passwordLabel')}
                    isRequired
                    tooltip={t('auth.passwordTooltip')}
                  />
                }
                rules={[
                  { required: true, message: t('auth.passwordValidation') },
                  { min: 6, message: t('auth.passwordMin') },
                ]}
                className="mb-6"
              >
                <CustomInput
                  type="password"
                  prefixIcon={<LockOutlined />}
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </Form.Item>

              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                block
                loading={isLoading}
                onClick={() => form.submit()}
                className="mt-2"
              >
                {isLoading ? t('auth.submitting') : t('auth.submitButton')}
              </CustomButton>
            </Form>

            <Divider plain className="my-6 text-slate-400 dark:text-slate-500 text-[11px] font-semibold">
              {t('auth.quickAccounts')}
            </Divider>

            {/* Quick Credential Fill Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillQuickCredentials('gautamanguraj16@gmail.com', 'Test@123')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 bg-slate-50/80 dark:bg-slate-900/60 transition-all cursor-pointer group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {t('auth.superAdmin')}
                  </p>
                  <CheckOutlined className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">test@gmail.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('sowrish.mass123456@gmail.com', 'Test@123')}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 bg-slate-50/80 dark:bg-slate-900/60 transition-all cursor-pointer group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t('auth.standardUser')}
                  </p>
                  <CheckOutlined className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">sowrish.mass...</p>
              </button>
            </div>

            <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
              <SafetyCertificateFilled className="text-emerald-500" />
              <span>{t('auth.securityBadge')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
