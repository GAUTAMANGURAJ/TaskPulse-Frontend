import { useMemo } from 'react';
import { useUserPermissionsQuery } from '../api/roles';
import { useAuth } from '../context/AuthContext';
import {
  checkPermissionInData,
  checkModulePermissionInData,
} from '../utils/permissionUtils';

/**
 * Accesses user permissions query data from the cache.
 */
export function useUserPermissions() {
  const { user } = useAuth();
  return useUserPermissionsQuery(undefined, Boolean(user));
}

/**
 * Subscribes to the permissions query and exposes memoized permission checker functions.
 * Automatically accounts for Super Admin privileges.
 */
export function usePermissionDataChecks() {
  const { isSuperAdmin } = useAuth();
  const { data: permissionsData, isLoading } = useUserPermissions();

  return useMemo(
    () => ({
      permissionsData,
      isLoading,
      checkPermission: (
        moduleName: string,
        subModuleName: string,
        permissionName: string
      ): boolean =>
        checkPermissionInData(
          permissionsData,
          moduleName,
          subModuleName,
          permissionName,
          isSuperAdmin
        ),
      checkModulePermission: (moduleName: string): boolean =>
        checkModulePermissionInData(permissionsData, moduleName, isSuperAdmin),
    }),
    [permissionsData, isLoading, isSuperAdmin]
  );
}

/**
 * Single permission checker hook
 */
export function useHasPermission(
  moduleName: string,
  subModuleName: string,
  permissionName: string
): boolean {
  const { checkPermission } = usePermissionDataChecks();
  return checkPermission(moduleName, subModuleName, permissionName);
}
