import type { UserPermissionsData } from '../types/role';

/**
 * Checks whether the current user has access to a specific permission.
 * Super Admin bypasses all checks unconditionally.
 */
export function checkPermissionInData(
  permissionsData: UserPermissionsData | undefined,
  moduleName: string,
  subModuleName: string,
  permissionName: string,
  isSuperAdmin = false
): boolean {
  if (isSuperAdmin) {
    return true;
  }

  if (!permissionsData?.result || !Array.isArray(permissionsData.result)) {
    return false;
  }

  try {
    for (const module of permissionsData.result) {
      if (module.name === moduleName && module.active && !module.isDelete) {
        for (const subModule of module.subModuleDto || []) {
          if (subModule.name === subModuleName) {
            for (const permission of subModule.permissionDto || []) {
              if (
                permission.name === permissionName &&
                permission.active &&
                !permission.isDelete &&
                permission.selected
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error evaluating RBAC permission:', error);
    return false;
  }
}

/**
 * Checks whether the user has access to at least one active selected permission in a module.
 * Useful for showing/hiding top-level menu tabs and sidebar sections.
 */
export function checkModulePermissionInData(
  permissionsData: UserPermissionsData | undefined,
  moduleName: string,
  isSuperAdmin = false
): boolean {
  if (isSuperAdmin) {
    return true;
  }

  if (!permissionsData?.result || !Array.isArray(permissionsData.result)) {
    return false;
  }

  try {
    for (const module of permissionsData.result) {
      if (module.name === moduleName && module.active && !module.isDelete) {
        for (const subModule of module.subModuleDto || []) {
          for (const permission of subModule.permissionDto || []) {
            if (permission.active && !permission.isDelete && permission.selected) {
              return true;
            }
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error evaluating RBAC module access:', error);
    return false;
  }
}
