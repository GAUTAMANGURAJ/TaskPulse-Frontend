import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../common/LoadingState';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSuperAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingState tip="Checking administrative permissions..." />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Result
          status="403"
          icon={<ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />}
          title={<span className="text-2xl font-bold">Access Denied</span>}
          subTitle={
            <span className="text-slate-500">
              Only Super Administrators have permission to manage system users and roles.
            </span>
          }
          extra={
            <Button
              type="primary"
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
