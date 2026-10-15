import type { User } from '../types/user';
import type { ColumnConfig } from './roles';

/**
 * TaskPulse Enterprise - Users Table Column Configurations
 * Strictly aligned with Robolab enterprise table column standards
 */
export const useUserListColumns = (
  t: (keyPath: string, params?: Record<string, string | number>) => string,
  showActionColumn: boolean = true,
): ColumnConfig[] => {
  return [
    ...(showActionColumn
      ? [{ field: 'action', header: t('tableHeaders.internalUsers.actions') }]
      : []),
    {
      field: 'name',
      header: t('tableHeaders.internalUsers.nameAndEmail'),
    },
    {
      field: 'role',
      header: t('tableHeaders.internalUsers.roles'),
    },
    {
      field: 'status',
      header: t('tableHeaders.internalUsers.status'),
    },
    {
      field: 'createdAt',
      header: t('tableHeaders.internalUsers.createdAt'),
    },
  ];
};

/**
 * Generates Action Menu items for user list table records
 * Strictly mirrors Robolab getInternalUserActionMenu implementation
 */
export const getInternalUserActionMenu = (
  user: User,
  t: (keyPath: string, params?: Record<string, string | number>) => string,
  currentUserId?: number,
  hasEditPermission: boolean = true,
  hasStatusUpdatePermission: boolean = true,
) => {
  const isSelf = user.id === currentUserId;
  const isActive = Boolean(user.is_active);

  const menuItems: Array<{ key: string; label: string; value: string; disabled?: boolean }> = [];

  if (hasEditPermission) {
    menuItems.push({
      key: 'edit',
      label: t('common.edit'),
      value: 'edit',
      disabled: false,
    });
  }

  if (hasStatusUpdatePermission) {
    if (isActive) {
      menuItems.push({
        key: 'suspend',
        label: t('rolesAndPermissionsModule.actionMenu.deactivate'),
        value: 'suspend',
        disabled: isSelf,
      });
    } else {
      menuItems.push({
        key: 'reactivate',
        label: t('rolesAndPermissionsModule.actionMenu.reactivate'),
        value: 'reactivate',
        disabled: isSelf,
      });
    }
  }

  return menuItems;
};
