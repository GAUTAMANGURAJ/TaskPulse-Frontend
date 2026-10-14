import React, { useState } from 'react';
import { Card, Progress, Button, Table, Space, Tag } from 'antd';
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
import { CustomStatCard } from '../components/custom/CustomStatCard';
import { CustomStatusBadge } from '../components/custom/CustomStatusBadge';
import { LoadingState } from '../components/common/LoadingState';
import { TodoModal } from '../components/todos/TodoModal';
import type { TodoItem } from '@/types/todo';

export const DashboardPage: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
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
      title: 'Task ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id: number) => <span className="font-mono text-xs text-slate-400">#{id}</span>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TodoItem) => (
        <span
          className={`font-semibold text-sm ${
            record.is_complete ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_complete',
      key: 'is_complete',
      width: 140,
      render: (isComplete: boolean) => (
        <CustomStatusBadge type="todo_status" value={isComplete} />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 130,
      render: (_, record: TodoItem) => (
        <Button
          size="small"
          type={record.is_complete ? 'default' : 'primary'}
          onClick={() => handleToggleStatus(record)}
          loading={updateTodoStatus.isPending && updateTodoStatus.variables?.id === record.id}
          className={!record.is_complete ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
        >
          {record.is_complete ? 'Reopen' : 'Mark Done'}
        </Button>
      ),
    },
  ];

  if (isTodosLoading || (isSuperAdmin && isUsersLoading)) {
    return <LoadingState tip="Assembling enterprise dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Operations Console
            </span>
            {isSuperAdmin && (
              <Tag color="purple" className="m-0 font-semibold text-xs">
                Super Admin Privilege
              </Tag>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hello, {user?.email}
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl">
            Welcome to the TaskPulse enterprise orchestration dashboard. Monitor system tasks, oversee user governance, and manage operational workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsCreateTodoModalOpen(true)}
            className="bg-white text-indigo-900 hover:bg-indigo-50 hover:text-indigo-950 font-bold border-none shadow-lg h-11"
          >
            Create Task
          </Button>
          {isSuperAdmin && (
            <Button
              ghost
              size="large"
              icon={<TeamOutlined />}
              onClick={() => navigate('/users')}
              className="border-indigo-400 text-white hover:border-white h-11"
            >
              Manage Users
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomStatCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="System-wide tasks"
          icon={<ThunderboltOutlined />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/50"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />

        <CustomStatCard
          title="Completed"
          value={completedTasks}
          subtitle={`${completionRate}% achieved`}
          icon={<CheckCircleOutlined />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        <CustomStatCard
          title="In Progress"
          value={pendingTasks}
          subtitle="Awaiting completion"
          icon={<ClockCircleOutlined />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
        />

        {isSuperAdmin ? (
          <CustomStatCard
            title="Total Users"
            value={totalUsersCount}
            subtitle={`${activeUsersCount} active accounts`}
            icon={<TeamOutlined />}
            iconBgColor="bg-purple-50 dark:bg-purple-950/50"
            iconColor="text-purple-600 dark:text-purple-400"
          />
        ) : (
          <CustomStatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle="Overall progress"
            icon={<CheckSquareOutlined />}
            iconBgColor="bg-violet-50 dark:bg-violet-950/50"
            iconColor="text-violet-600 dark:text-violet-400"
          />
        )}
      </div>

      {/* Main Grid: Progress & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Overview Card */}
        <Card
          title={<span className="font-bold text-base">Workflow Completion</span>}
          className="shadow-sm border border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <Progress
              type="circle"
              percent={completionRate}
              strokeColor={{
                '0%': '#4f46e5',
                '100%': '#10b981',
              }}
              size={150}
              strokeWidth={10}
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {completedTasks} of {totalTasks} Tasks Completed
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pendingTasks === 0 && totalTasks > 0
                  ? 'All tasks have been successfully concluded!'
                  : `${pendingTasks} tasks currently pending review.`}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-around text-xs">
              <div>
                <span className="block text-slate-400 font-medium">Closed</span>
                <span className="text-emerald-600 font-bold text-sm">{completedTasks}</span>
              </div>
              <div className="border-r border-slate-200 dark:border-slate-800" />
              <div>
                <span className="block text-slate-400 font-medium">Pending</span>
                <span className="text-amber-500 font-bold text-sm">{pendingTasks}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Tasks List */}
        <Card
          title={<span className="font-bold text-base">Recent Tasks</span>}
          extra={
            <Button
              type="link"
              onClick={() => navigate('/todos')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold p-0 flex items-center gap-1"
            >
              View All <RightOutlined className="text-xs" />
            </Button>
          }
          className="shadow-sm border border-slate-200/80 dark:border-slate-800 lg:col-span-2"
        >
          <Table
            columns={columns}
            dataSource={recentTodos}
            rowKey="id"
            pagination={false}
            size="small"
            locale={{ emptyText: 'No recent tasks found' }}
          />
        </Card>
      </div>

      {/* Task Creation Modal */}
      <TodoModal
        open={isCreateTodoModalOpen}
        onClose={() => setIsCreateTodoModalOpen(false)}
      />
    </div>
  );
};
