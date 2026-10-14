import React, { useState, useMemo } from 'react';
import { Card, Input, Radio, Button } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTodos, useDeleteTodo, useUpdateTodoStatus } from '../api/todos';
import { CustomDataTable } from '../components/custom/CustomDataTable';
import { CustomStatusBadge } from '../components/custom/CustomStatusBadge';
import { FeedbackState } from '../components/common/FeedbackState';
import { TodoModal } from '../components/todos/TodoModal';
import { getTodoColumns } from '../components/todos/TodoColumns';
import type { TodoItem } from '@/types/todo';

export const TodosPage: React.FC = () => {
  const { data: todos = [], isLoading, isError, error, refetch } = useTodos();
  const deleteTodo = useDeleteTodo();
  const updateTodoStatus = useUpdateTodoStatus();

  // Filter & presentation state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
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
      }),
    [deleteTodo, updateTodoStatus]
  );

  if (isError) {
    return (
      <FeedbackState
        status="error"
        title="Failed to Load Tasks"
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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise workflow and task tracking repository
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-600/20"
        >
          Create Task
        </Button>
      </div>

      {/* Control Bar: Search, Filters, View Modes */}
      <Card
        variant="borderless"
        className="shadow-sm border border-slate-200/80 dark:border-slate-800"
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="rounded-lg"
            />
          </div>

          <div className="flex items-center flex-wrap gap-3 justify-between md:justify-end">
            <Radio.Group
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="all">All ({todos.length})</Radio.Button>
              <Radio.Button value="active">
                In Progress ({todos.filter((t) => !t.is_complete).length})
              </Radio.Button>
              <Radio.Button value="completed">
                Completed ({todos.filter((t) => t.is_complete).length})
              </Radio.Button>
            </Radio.Group>

            <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="table" title="Table View">
                  <BarsOutlined />
                </Radio.Button>
                <Radio.Button value="grid" title="Grid View">
                  <AppstoreOutlined />
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Presentation */}
      {viewMode === 'table' ? (
        <CustomDataTable
          columns={columns}
          dataSource={filteredTodos}
          rowKey="id"
          isLoading={isLoading}
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
          emptyTitle="No Tasks Registered"
          emptyDescription="Start by adding your first task to the repository."
          actionText="Create New Task"
          onAction={handleCreate}
        />
      ) : (
        /* Grid Presentation */
        filteredTodos.length === 0 ? (
          <FeedbackState
            status={isFiltered ? 'filtered_empty' : 'empty'}
            title={isFiltered ? 'No Matching Tasks' : 'No Tasks in Repository'}
            description={
              isFiltered
                ? 'Try refining your keyword or clearing active status filters.'
                : 'Get started by creating your first task in the enterprise suite.'
            }
            onResetFilters={handleClearFilters}
            actionText="Create New Task"
            onAction={handleCreate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                className={`transition-all duration-300 hover:shadow-md border ${
                  todo.is_complete
                    ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
                styles={{ body: { padding: '20px' } }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-xs text-slate-400">#{todo.id}</span>
                  <CustomStatusBadge type="todo_status" value={todo.is_complete} />
                </div>

                <h3
                  className={`text-base font-bold mb-2 line-clamp-1 ${
                    todo.is_complete
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {todo.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 min-h-[48px]">
                  {todo.description || 'No additional description provided.'}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Button
                    size="small"
                    type={todo.is_complete ? 'default' : 'primary'}
                    onClick={() =>
                      updateTodoStatus.mutate({ id: todo.id, isComplete: !todo.is_complete })
                    }
                    loading={
                      updateTodoStatus.isPending &&
                      (updateTodoStatus.variables as { id?: number })?.id === todo.id
                    }
                    className={!todo.is_complete ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    {todo.is_complete ? 'Reopen' : 'Mark Done'}
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined className="text-slate-500" />}
                      onClick={() => handleEdit(todo)}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo.mutate(todo.id)}
                    />
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
