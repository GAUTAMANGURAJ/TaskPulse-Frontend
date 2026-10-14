import React, { useState, useMemo } from 'react';
import { Card, Input, Radio, Button } from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useUsers, useUpdateUserStatus } from '../api/users';
import { CustomDataTable } from '../components/custom/CustomDataTable';
import { FeedbackState } from '../components/common/FeedbackState';
import { UserModal } from '../components/users/UserModal';
import { UserDetailDrawer } from '../components/users/UserDetailDrawer';
import { getUserColumns } from '../components/users/UserColumns';
import type { User } from '@/types/user';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading, isError, error, refetch } = useUsers(true);
  const updateUserStatus = useUpdateUserStatus();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admins' | 'standard'>('all');
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

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser?.id && user.is_active) {
      return;
    }
    updateUserStatus.mutate({
      id: user.id,
      isActive: !user.is_active,
    });
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onView: (user) => setUserToView(user),
        onToggleStatus: handleToggleStatus,
        currentUserId: currentUser?.id,
        isStatusPending: updateUserStatus.isPending,
        statusPendingId: (updateUserStatus.variables as { id?: number })?.id,
      }),
    [currentUser, updateUserStatus]
  );

  if (isError) {
    return (
      <FeedbackState
        status="error"
        title="Failed to Load System Users"
        description={error instanceof Error ? error.message : 'Unknown communication error'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            User Governance & RBAC
            <SafetyCertificateOutlined className="text-indigo-600 text-xl" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage system access, provision accounts, and oversee administrator permissions
          </p>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-600/20"
        >
          Provision User
        </Button>
      </div>

      {/* Control Bar: Search & Role Filters */}
      <Card
        variant="borderless"
        className="shadow-sm border border-slate-200/80 dark:border-slate-800"
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search user by email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="rounded-lg"
            />
          </div>

          <Radio.Group
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="all">All Users ({users.length})</Radio.Button>
            <Radio.Button value="admins">
              Super Admins ({users.filter((u) => u.is_superuser).length})
            </Radio.Button>
            <Radio.Button value="standard">
              Standard Users ({users.filter((u) => !u.is_superuser).length})
            </Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      {/* Users Data Table */}
      <CustomDataTable
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        isLoading={isLoading}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        emptyTitle="No Users Found"
        emptyDescription="No system users matched the selected filter or search criteria."
        actionText="Provision New User"
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
