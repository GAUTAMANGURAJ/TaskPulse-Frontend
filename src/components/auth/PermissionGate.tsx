import React from 'react';
import { useAuth } from '../../context/AuthContext';

export interface PermissionGateProps {
  requireSuperUser?: boolean;
  requireActive?: boolean;
  fallback?: 'hide' | 'disable' | React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative RBAC Gate implementing Pirai permissions-session contract.
 * Controls UI visibility or interactive capability based on session authority.
 * Note: Presentation gate only — does not substitute for backend authorization.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  requireSuperUser = false,
  requireActive = true,
  fallback = 'hide',
  children,
}) => {
  const { user, isAuthenticated, isSuperAdmin, isLoading } = useAuth();

  // Guard against flashing during session checks
  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const hasRole = !requireSuperUser || isSuperAdmin;
  const hasActive = !requireActive || user.is_active;
  const isAllowed = hasRole && hasActive;

  if (isAllowed) {
    return <>{children}</>;
  }

  // Handle fallback presentations
  if (fallback === 'hide') {
    return null;
  }

  if (fallback === 'disable') {
    return (
      <div className="opacity-50 pointer-events-none cursor-not-allowed select-none">
        {children}
      </div>
    );
  }

  return <>{fallback}</>;
};
