import React, { useState, useMemo, useCallback } from 'react';
import {
  SafetyCertificateOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRoleList, useUpdateRoleStatus } from '../api/roles';
import {
  CustomButton,
  CustomDataTable,
  CustomSearchBar,
  CustomPageHeader,
  CustomControlBar,
  CustomSegmentedTabs,
} from '../components/custom';
import { FeedbackState } from '../components/common/FeedbackState';
import { AddRoleDrawer } from '../components/roles/AddRoleDrawer';
import { RolePermissionsDrawer } from '../components/roles/RolePermissionsDrawer';
import { getRoleColumns } from '../components/roles/RoleColumns';
import { useI18n } from '../i18n/I18nContext';
import { MODULES, SUB_MODULES, PERMISSIONS } from '../constants/modulesAndPermissions';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import type { Role } from '../types/role';

type RoleStatusFilter = 'all' | 'active' | 'inactive';

export const RolesPage: React.FC = () => {
  const { t, formatDate } = useI18n();
  const { data: roles = [], isLoading, isError, error, refetch } = useRoleList();
  const updateRoleStatus = useUpdateRoleStatus();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoleStatusFilter>('all');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleForPermissions, setRoleForPermissions] = useState<Role | null>(null);

  const isFiltered = searchQuery.trim().length > 0 || statusFilter !== 'all';

  // Filter roles based on search and status
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? role.is_active
          : !role.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [roles, searchQuery, statusFilter]);

  const handleCreate = useCallback(() => {
    setRoleToEdit(null);
    setIsAddDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((role: Role) => {
    setRoleToEdit(role);
    setIsAddDrawerOpen(true);
  }, []);

  const handleManagePermissions = useCallback((role: Role) => {
    setRoleForPermissions(role);
  }, []);

  const handleToggleStatus = useCallback(
    (role: Role) => {
      updateRoleStatus.mutate({
        roleId: role.id,
        is_active: !role.is_active,
      });
    },
    [updateRoleStatus]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  const columns = useMemo(
    () =>
      getRoleColumns({
        onEdit: handleEdit,
        onManagePermissions: handleManagePermissions,
        onToggleStatus: handleToggleStatus,
        isStatusPending: updateRoleStatus.isPending,
        statusPendingId: (updateRoleStatus.variables as { roleId?: number })?.roleId,
        t,
        formatDate,
      }),
    [handleEdit, handleManagePermissions, handleToggleStatus, updateRoleStatus.isPending, updateRoleStatus.variables, t, formatDate]
  );

  if (isError) {
    return (
      <FeedbackState
        status="error"
        title={t('roles.loadErrorTitle')}
        description={error instanceof Error ? error.message : t('common.systemError')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <CustomPageHeader
        title={t('roles.title')}
        subtitle={t('roles.subtitle')}
        icon={<SafetyCertificateOutlined />}
        actions={
          <PermissionGuard
            module={MODULES.ROLES_MANAGEMENT}
            subModule={SUB_MODULES.ROLES_MANAGEMENT}
            permission={PERMISSIONS.ROLES_MANAGEMENT.CREATE}
          >
            <CustomButton
              variant="primary"
              size="md"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              {t('roles.addRole')}
            </CustomButton>
          </PermissionGuard>
        }
      />

      {/* Standardized Control Bar: Search and Status Filters */}
      <CustomControlBar
        searchSlot={
          <CustomSearchBar
            placeholder={t('roles.searchPlaceholder')}
            value={searchQuery}
            onChange={setSearchQuery}
            totalCount={roles.length}
            filteredCount={filteredRoles.length}
          />
        }
        filterSlot={
          <CustomSegmentedTabs<RoleStatusFilter>
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: t('roles.allRoles'), value: 'all', count: roles.length },
              { label: t('roles.activeRoles'), value: 'active', count: roles.filter((r) => r.is_active).length },
              { label: t('roles.inactiveRoles'), value: 'inactive', count: roles.filter((r) => !r.is_active).length },
            ]}
          />
        }
      />

      {/* Roles Data Table */}
      <CustomDataTable
        columns={columns}
        dataSource={filteredRoles}
        rowKey="id"
        isLoading={isLoading}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        emptyTitle={t('roles.noRolesTitle')}
        emptyDescription={t('roles.noRolesDesc')}
        actionText={t('roles.addRole')}
        onAction={handleCreate}
      />

      {/* Add / Edit Role Drawer */}
      <AddRoleDrawer
        open={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        roleToEdit={roleToEdit}
      />

      {/* Manage Permissions Matrix Drawer */}
      <RolePermissionsDrawer
        open={Boolean(roleForPermissions)}
        onClose={() => setRoleForPermissions(null)}
        role={roleForPermissions}
      />
    </div>
  );
};
