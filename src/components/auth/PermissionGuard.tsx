import React from 'react';
import { usePermissionDataChecks } from '../../hooks/useUserPermissions';

interface PermissionGuardProps {
  module: string;
  subModule: string;
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  disabledMode?: boolean;
}

/**
 * Declarative component-level RBAC guard.
 * Shows children only if the current user possesses the required permission.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  subModule,
  permission,
  children,
  fallback = null,
  disabledMode = false,
}) => {
  const { checkPermission, isLoading } = usePermissionDataChecks();

  if (isLoading) {
    return null;
  }

  const hasAccess = checkPermission(module, subModule, permission);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (disabledMode && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ disabled?: boolean; className?: string }>, {
      disabled: true,
      className: `${(children.props as { className?: string }).className || ''} opacity-50 cursor-not-allowed pointer-events-none`,
    });
  }

  return <>{fallback}</>;
};
