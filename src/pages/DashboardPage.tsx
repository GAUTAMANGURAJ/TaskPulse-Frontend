import React, { useState } from 'react';
import { Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  RightOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTodos, useUpdateTodoStatus } from '../api/todos';
import { useUsers } from '../api/users';
import {
  CustomStatCard,
  CustomStatusBadge,
  CustomButton,
  CustomCard,
} from '../components/custom';
import { LoadingState } from '../components/common/LoadingState';
import { TodoModal } from '../components/todos/TodoModal';
import { useI18n } from '../i18n/I18nContext';
import type { TodoItem } from '@/types/todo';

export const DashboardPage: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const { t, formatNumber } = useI18n();
  const navigate = useNavigate();
  const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = useState(false);

  // Queries
  const { data: todos = [], isLoading: isTodosLoading } = useTodos();
  const { data: users = [], isLoading: isUsersLoading } = useUsers(isSuperAdmin);
  const updateTodoStatus = useUpdateTodoStatus();

  // Computations
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.is_complete).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.is_active).length;

  const recentTodos = [...todos].slice(-5).reverse();

  const handleToggleStatus = (todo: TodoItem) => {
    updateTodoStatus.mutate({
      id: todo.id,
      isComplete: !todo.is_complete,
    });
  };

  const columns: ColumnsType<TodoItem> = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <span className="font-mono text-xs text-theme-muted font-semibold">#{id}</span>,
    },
    {
      title: t('tasks.taskTitle'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TodoItem) => (
        <span
          className={`font-semibold text-sm transition-colors ${
            record.is_complete
              ? 'line-through text-theme-muted'
              : 'text-theme-title'
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'is_complete',
      key: 'is_complete',
      width: 140,
      render: (isComplete: boolean) => (
        <CustomStatusBadge type="todo_status" value={isComplete} />
      ),
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 130,
      render: (_, record: TodoItem) => (
        <CustomButton
          size="sm"
          variant={record.is_complete ? 'secondary' : 'primary'}
          onClick={() => handleToggleStatus(record)}
          loading={updateTodoStatus.isPending && updateTodoStatus.variables?.id === record.id}
        >
          {record.is_complete ? t('common.reopen') : t('common.markDone')}
        </CustomButton>
      ),
    },
  ];

  if (isTodosLoading || (isSuperAdmin && isUsersLoading)) {
    return <LoadingState tip={t('common.loading')} />;
  }

  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {t('dashboard.title')}
            </span>
            {isSuperAdmin && (
              <span className="badge-pill badge-pill-role-admin text-[11px]">
                {t('auth.superAdmin')}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {user?.email}
          </h2>
          <p className="text-sm text-indigo-200/90 max-w-xl font-normal leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <CustomButton
            variant="primary"
            size="lg"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateTodoModalOpen(true)}
          >
            {t('tasks.createTask')}
          </CustomButton>
          {isSuperAdmin && (
            <CustomButton
              variant="secondary"
              size="lg"
              icon={<TeamOutlined />}
              onClick={() => navigate('/users')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              {t('users.title')}
            </CustomButton>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomStatCard
          title={t('dashboard.totalTasks')}
          value={formatNumber(totalTasks)}
          subtitle={t('dashboard.indexedSubtitle')}
          icon={<ThunderboltOutlined />}
          iconBgColor="surface-subtle"
          iconColor="text-theme-accent"
          trend={{ value: '12%', isPositive: true }}
        />

        <CustomStatCard
          title={t('dashboard.completedTasks')}
          value={formatNumber(completedTasks)}
          subtitle={`${completionRate}% ${t('dashboard.completionRate').toLowerCase()}`}
          icon={<CheckCircleOutlined />}
          iconBgColor="surface-subtle"
          iconColor="text-theme-active"
          trend={{ value: '18%', isPositive: true }}
        />

        <CustomStatCard
          title={t('dashboard.pendingTasks')}
          value={formatNumber(pendingTasks)}
          subtitle={t('dashboard.pendingSubtitle')}
          icon={<ClockCircleOutlined />}
          iconBgColor="surface-subtle"
          iconColor="text-theme-muted"
        />

        {isSuperAdmin ? (
          <CustomStatCard
            title={t('dashboard.totalUsers')}
            value={formatNumber(totalUsersCount)}
            subtitle={`${activeUsersCount} ${t('users.active').toLowerCase()}`}
            icon={<TeamOutlined />}
            iconBgColor="surface-subtle"
            iconColor="text-theme-accent"
            trend={{ value: '4%', isPositive: true }}
          />
        ) : (
          <CustomStatCard
            title={t('dashboard.completionRate')}
            value={`${completionRate}%`}
            subtitle={t('dashboard.overallProgressSubtitle')}
            icon={<CheckSquareOutlined />}
            iconBgColor="surface-subtle"
            iconColor="text-theme-accent"
          />
        )}
      </div>

      {/* Progress & Recent Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Overview Card */}
        <CustomCard
          title={<span className="font-bold text-base text-theme-title">{t('dashboard.workflowProgress')}</span>}
        >
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <Progress
              type="circle"
              percent={completionRate}
              strokeColor={{
                '0%': 'var(--primary-color)',
                '100%': 'var(--success-color)',
              }}
              size={155}
              strokeWidth={10}
            />
            <div className="space-y-1">
              <h4 className="font-bold text-theme-title text-lg">
                {t('dashboard.tasksCompletedOf', { completed: completedTasks, total: totalTasks })}
              </h4>
              <p className="text-xs text-theme-muted">
                {pendingTasks === 0 && totalTasks > 0
                  ? t('dashboard.allConcluded')
                  : t('dashboard.pendingReview', { count: pendingTasks })}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-theme-divider flex justify-around text-xs">
              <div>
                <span className="block text-theme-muted font-semibold">{t('tasks.completed')}</span>
                <span className="text-theme-active font-black text-sm">{completedTasks}</span>
              </div>
              <div className="border-r border-theme-divider" />
              <div>
                <span className="block text-theme-muted font-semibold">{t('tasks.inProgress')}</span>
                <span className="text-theme-muted font-black text-sm">{pendingTasks}</span>
              </div>
            </div>
          </div>
        </CustomCard>

        {/* Recent Tasks Table */}
        <CustomCard
          title={<span className="font-bold text-base text-theme-title">{t('dashboard.recentTasks')}</span>}
          extra={
            <button
              type="button"
              onClick={() => navigate('/todos')}
              className="text-theme-accent font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none"
            >
              <span>{t('dashboard.viewAllTasks')}</span>
              <RightOutlined className="text-[10px]" />
            </button>
          }
          className="lg:col-span-2 overflow-hidden"
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={recentTodos}
              rowKey="id"
              pagination={false}
              size="middle"
              className="ant-table-modern"
              locale={{ emptyText: t('tasks.noTasksTitle') }}
            />
          </div>
        </CustomCard>
      </div>

      {/* Task Creation Modal */}
      <TodoModal
        open={isCreateTodoModalOpen}
        onClose={() => setIsCreateTodoModalOpen(false)}
      />
    </div>
  );
};
