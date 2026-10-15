import type { Role } from '../types/role';

export interface ColumnConfig {
  field: string;
  header: string;
}

/**
 * TaskPulse Enterprise - Roles Table Column Configurations
 * Strictly aligned with Robolab enterprise table column standards
 */
export const useRolesColumns = (
  t: (keyPath: string, params?: Record<string, string | number>) => string,
  showActionColumn: boolean = true,
): ColumnConfig[] => {
  return [
    ...(showActionColumn
      ? [{ field: 'action', header: t('tableHeaders.roles.action') }]
      : []),
    {
      field: 'roleName',
      header: t('tableHeaders.roles.roleName'),
    },
    {
      field: 'permission',
      header: t('tableHeaders.roles.permission'),
    },
    {
      field: 'status',
      header: t('tableHeaders.roles.status'),
    },
    {
      field: 'createdAt',
      header: t('tableHeaders.roles.createdAt'),
    },
  ];
};

/**
 * Generates Action Menu items for roles table records
 * Strictly mirrors Robolab getRolesActionMenu implementation
 */
export const getRolesActionMenu = (
  item: Role,
  t: (keyPath: string, params?: Record<string, string | number>) => string,
  hasEditPermission: boolean = true,
  hasStatusUpdatePermission: boolean = true,
  hasViewPermission: boolean = true,
) => {
  const isSuperAdminRole = item.id === 1;
  const isActive = Boolean(item.is_active);

  const menuItems: Array<{ key: string; label: string; value: string; disabled?: boolean }> = [];

  if (hasViewPermission) {
    menuItems.push({
      key: 'assign',
      label: t('rolesAndPermissionsModule.actionMenu.assign'),
      value: 'assign',
      disabled: false,
    });
  }

  if (hasEditPermission) {
    menuItems.push({
      key: 'edit',
      label: t('rolesAndPermissionsModule.actionMenu.edit'),
      value: 'edit',
      disabled: isSuperAdminRole,
    });
  }

  if (hasStatusUpdatePermission) {
    if (isActive) {
      menuItems.push({
        key: 'deactivate',
        label: t('rolesAndPermissionsModule.actionMenu.deactivate'),
        value: 'deactivate',
        disabled: isSuperAdminRole,
      });
    } else {
      menuItems.push({
        key: 'reactivate',
        label: t('rolesAndPermissionsModule.actionMenu.reactivate'),
        value: 'reactivate',
        disabled: isSuperAdminRole,
      });
    }
  }

  return menuItems;
};
