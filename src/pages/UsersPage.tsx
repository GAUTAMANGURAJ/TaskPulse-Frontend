import React, { useState, useMemo, useCallback } from 'react';
import {
  UserAddOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useUsers, useUpdateUserStatus } from '../api/users';
import {
  CustomButton,
  CustomDataTable,
  CustomSearchBar,
  CustomPageHeader,
  CustomControlBar,
  CustomSegmentedTabs,
} from '../components/custom';
import { FeedbackState } from '../components/common/FeedbackState';
import { UserModal } from '../components/users/UserModal';
import { UserDetailDrawer } from '../components/users/UserDetailDrawer';
import { getUserColumns } from '../components/users/UserColumns';
import { MODULES, SUB_MODULES, PERMISSIONS } from '../constants/modulesAndPermissions';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { useI18n } from '../i18n/I18nContext';
import type { User } from '@/types/user';

type UserRoleFilter = 'all' | 'admins' | 'standard';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { t, formatDate } = useI18n();
  const { data: users = [], isLoading, isError, error, refetch } = useUsers(true);
  const updateUserStatus = useUpdateUserStatus();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToView, setUserToView] = useState<User | null>(null);

  const isFiltered = searchQuery.trim().length > 0 || roleFilter !== 'all';

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === 'all'
          ? true
          : roleFilter === 'admins'
          ? u.is_superuser
          : !u.is_superuser;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleEdit = useCallback((user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  }, []);

  const handleView = useCallback((user: User) => {
    setUserToView(user);
  }, []);

  const handleCreate = useCallback(() => {
    setUserToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setRoleFilter('all');
  }, []);

  const handleToggleStatus = useCallback(
    (user: User) => {
      if (user.id === currentUser?.id && user.is_active) {
        return;
      }
      updateUserStatus.mutate({
        id: user.id,
        isActive: !user.is_active,
      });
    },
    [currentUser?.id, updateUserStatus]
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onView: handleView,
        onToggleStatus: handleToggleStatus,
        currentUserId: currentUser?.id,
        isStatusPending: updateUserStatus.isPending,
        statusPendingId: (updateUserStatus.variables as { id?: number })?.id,
        t,
        formatDate,
      }),
    [handleEdit, handleView, handleToggleStatus, currentUser?.id, updateUserStatus.isPending, updateUserStatus.variables, t, formatDate]
  );

  if (isError) {
    return (
      <FeedbackState
        status="error"
        title={t('users.loadErrorTitle')}
        description={error instanceof Error ? error.message : t('common.systemError')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <CustomPageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        icon={<SafetyCertificateOutlined />}
        actions={
          <PermissionGuard
            module={MODULES.USER_MANAGEMENT}
            subModule={SUB_MODULES.USER_MANAGEMENT}
            permission={PERMISSIONS.USER_MANAGEMENT.CREATE}
          >
            <CustomButton
              variant="primary"
              size="md"
              icon={<UserAddOutlined />}
              onClick={handleCreate}
            >
              {t('users.provisionUser')}
            </CustomButton>
          </PermissionGuard>
        }
      />

      {/* Standardized Control Bar: Search & Role Filter Tabs */}
      <CustomControlBar
        searchSlot={
          <CustomSearchBar
            placeholder={t('users.searchPlaceholder')}
            value={searchQuery}
            onChange={setSearchQuery}
            totalCount={users.length}
            filteredCount={filteredUsers.length}
          />
        }
        filterSlot={
          <CustomSegmentedTabs<UserRoleFilter>
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { label: t('users.allUsers'), value: 'all', count: users.length },
              { label: t('users.superAdmins'), value: 'admins', count: users.filter((u) => u.is_superuser).length },
              { label: t('users.standardUsers'), value: 'standard', count: users.filter((u) => !u.is_superuser).length },
            ]}
          />
        }
      />

      {/* Users Data Table */}
      <CustomDataTable
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        isLoading={isLoading}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        emptyTitle={t('users.noUsersTitle')}
        emptyDescription={t('users.noUsersDesc')}
        actionText={t('users.provisionUser')}
        onAction={handleCreate}
      />

      {/* User Modal */}
      <UserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        currentUserId={currentUser?.id}
      />

      {/* User Detail Drawer */}
      <UserDetailDrawer
        open={Boolean(userToView)}
        onClose={() => setUserToView(null)}
        user={userToView}
        onEdit={(user) => {
          setUserToView(null);
          handleEdit(user);
        }}
      />
    </div>
  );
};
