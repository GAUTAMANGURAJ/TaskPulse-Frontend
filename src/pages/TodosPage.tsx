import React, { useState, useMemo } from 'react';
import { Card, Popconfirm } from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTodos, useDeleteTodo, useUpdateTodoStatus } from '../api/todos';
import {
  CustomButton,
  CustomDataTable,
  CustomSearchBar,
  CustomStatusBadge,
  CustomPageHeader,
  CustomControlBar,
  CustomSegmentedTabs,
} from '../components/custom';
import { FeedbackState } from '../components/common/FeedbackState';
import { TodoModal } from '../components/todos/TodoModal';
import { getTodoColumns } from '../components/todos/TodoColumns';
import { useI18n } from '../i18n/I18nContext';
import type { TodoItem } from '@/types/todo';

type TodoStatusFilter = 'all' | 'active' | 'completed';

export const TodosPage: React.FC = () => {
  const { t } = useI18n();
  const { data: todos = [], isLoading, isError, error, refetch } = useTodos();
  const deleteTodo = useDeleteTodo();
  const updateTodoStatus = useUpdateTodoStatus();

  // Filter & presentation state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  const isFiltered = searchQuery.trim().length > 0 || statusFilter !== 'all';

  // Filtered dataset
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
          ? todo.is_complete
          : !todo.is_complete;

      return matchesSearch && matchesStatus;
    });
  }, [todos, searchQuery, statusFilter]);

  const handleEdit = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Modular column definition with bound action handlers
  const columns = useMemo(
    () =>
      getTodoColumns({
        onEdit: handleEdit,
        onDelete: (id) => deleteTodo.mutate(id),
        onToggleStatus: (id, currentStatus) =>
          updateTodoStatus.mutate({ id, isComplete: !currentStatus }),
        isStatusPending: updateTodoStatus.isPending,
        statusPendingId: (updateTodoStatus.variables as { id?: number })?.id,
        isDeletePending: deleteTodo.isPending,
        t,
      }),
    [deleteTodo, updateTodoStatus, t]
  );

  if (isError) {
    return (
      <FeedbackState
        status="error"
        title={t('tasks.noMatchingTitle')}
        description={error instanceof Error ? error.message : t('common.systemError')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <CustomPageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        actions={
          <CustomButton
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            {t('tasks.createTask')}
          </CustomButton>
        }
      />

      {/* Standardized Control Bar: Search, Filters, View Modes */}
      <CustomControlBar
        searchSlot={
          <CustomSearchBar
            placeholder={t('tasks.searchPlaceholder')}
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            totalCount={todos.length}
            filteredCount={filteredTodos.length}
          />
        }
        filterSlot={
          <CustomSegmentedTabs<TodoStatusFilter>
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: t('tasks.allTasks'), value: 'all', count: todos.length },
              { label: t('tasks.inProgress'), value: 'active', count: todos.filter((t) => !t.is_complete).length },
              { label: t('tasks.completed'), value: 'completed', count: todos.filter((t) => t.is_complete).length },
            ]}
          />
        }
        actionSlot={
          <div className="border-l border-theme-divider pl-3">
            <CustomSegmentedTabs<'table' | 'grid'>
              value={viewMode}
              onChange={(val) => setViewMode(val)}
              options={[
                { label: t('tasks.tableView'), value: 'table', icon: <BarsOutlined /> },
                { label: t('tasks.gridView'), value: 'grid', icon: <AppstoreOutlined /> },
              ]}
            />
          </div>
        }
      />

      {/* Data Presentation */}
      {viewMode === 'table' ? (
        <CustomDataTable
          columns={columns}
          dataSource={filteredTodos}
          rowKey="id"
          isLoading={isLoading}
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
          emptyTitle={t('tasks.noTasksTitle')}
          emptyDescription={t('tasks.noTasksDesc')}
          actionText={t('tasks.createTask')}
          onAction={handleCreate}
        />
      ) : (
        /* Grid Presentation */
        filteredTodos.length === 0 ? (
          <FeedbackState
            status={isFiltered ? 'filtered_empty' : 'empty'}
            title={isFiltered ? t('tasks.noMatchingTitle') : t('tasks.noTasksTitle')}
            description={
              isFiltered
                ? t('tasks.noMatchingDesc')
                : t('tasks.noTasksDesc')
            }
            onResetFilters={handleClearFilters}
            actionText={t('tasks.createTask')}
            onAction={handleCreate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                className={`card-enterprise subtle-lift transition-all duration-300 border ${
                  todo.is_complete
                    ? 'border-[var(--status-success-border)] bg-[var(--status-success-bg)]'
                    : 'border-theme-divider'
                }`}
                styles={{ body: { padding: '20px' } }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-xs font-semibold text-theme-muted">#{todo.id}</span>
                  <CustomStatusBadge type="todo_status" value={todo.is_complete} />
                </div>

                <h3
                  className={`text-base font-bold mb-2 line-clamp-1 ${
                    todo.is_complete
                      ? 'line-through text-theme-muted'
                      : 'text-theme-title'
                  }`}
                >
                  {todo.title}
                </h3>

                <p className="text-xs text-theme-body line-clamp-3 mb-6 min-h-[48px]">
                  {todo.description || t('tasks.noAdditionalContext')}
                </p>

                <div className="pt-3 border-t border-theme-divider flex items-center justify-between">
                  <CustomButton
                    size="sm"
                    variant={todo.is_complete ? 'secondary' : 'primary'}
                    onClick={() =>
                      updateTodoStatus.mutate({ id: todo.id, isComplete: !todo.is_complete })
                    }
                    loading={
                      updateTodoStatus.isPending &&
                      (updateTodoStatus.variables as { id?: number })?.id === todo.id
                    }
                  >
                    {todo.is_complete ? t('common.reopen') : t('common.markDone')}
                  </CustomButton>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(todo)}
                      className="p-1.5 rounded-lg text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
                      title={t('common.edit')}
                    >
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title={t('tasks.deleteTask')}
                      description={t('tasks.deleteConfirm')}
                      onConfirm={() => deleteTodo.mutate(todo.id)}
                      okText={t('tasks.confirmDelete')}
                      cancelText={t('tasks.cancel')}
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-theme-muted hover:text-theme-inactive transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Task Modal */}
      <TodoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todoToEdit={selectedTodo}
      />
    </div>
  );
};
