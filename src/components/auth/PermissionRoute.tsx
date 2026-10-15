import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissionDataChecks } from '../../hooks/useUserPermissions';
import { LoadingState } from '../common/LoadingState';
import { useI18n } from '../../i18n/I18nContext';

interface PermissionRouteProps {
  module: string;
  subModule?: string;
  permission?: string;
  children: React.ReactNode;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  module,
  subModule,
  permission,
  children,
}) => {
  const { isLoading: isAuthLoading } = useAuth();
  const { checkPermission, checkModulePermission, isLoading: isPermLoading } =
    usePermissionDataChecks();
  const navigate = useNavigate();
  const { t } = useI18n();

  if (isAuthLoading || isPermLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState tip="Verifying authorization permissions..." />
      </div>
    );
  }

  const hasAccess = permission && subModule
    ? checkPermission(module, subModule, permission)
    : checkModulePermission(module);

  if (!hasAccess) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Result
          status="403"
          icon={<ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />}
          title={
            <span className="text-2xl font-bold text-theme-title">
              {t('common.accessDenied')}
            </span>
          }
          subTitle={
            <span className="text-theme-muted">
              {t('common.accessDeniedDesc')}
            </span>
          }
          extra={
            <Button
              type="primary"
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
            >
              {t('nav.dashboard')}
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
