import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../service/apiClient';
import { ENDPOINTS } from '../constants/endpoints';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import {
  todoResponseSchema,
  todoListResponseSchema,
  todoStatusResponseSchema,
} from '@/schemas/todo';
import { validateApiResponse } from '@/schemas/common';
import type { TodoItem, TodoCreatePayload, TodoUpdatePayload } from '@/types/todo';

export const TODO_QUERY_KEYS = {
  ALL: ['todos'] as const,
  DETAIL: (id: number | string) => ['todos', id] as const,
};

// Fetchers with Pirai Runtime Validation Contract & Signal Support
export const fetchTodos = async (signal?: AbortSignal): Promise<TodoItem[]> => {
  const raw = await apiClient.get<unknown>(ENDPOINTS.TODOS.LIST, { signal });
  return validateApiResponse(todoListResponseSchema, raw);
};

export const fetchTodoById = async (id: number | string, signal?: AbortSignal): Promise<TodoItem> => {
  const raw = await apiClient.get<unknown>(ENDPOINTS.TODOS.GET_BY_ID(id), { signal });
  return validateApiResponse(todoResponseSchema, raw);
};

export const createTodoRequest = async (
  data: TodoCreatePayload,
  signal?: AbortSignal
): Promise<TodoItem> => {
  const raw = await apiClient.post<unknown>(ENDPOINTS.TODOS.CREATE, data, { signal });
  return validateApiResponse(todoResponseSchema, raw);
};

export const updateTodoRequest = async ({
  id,
  data,
  signal,
}: {
  id: number | string;
  data: TodoUpdatePayload;
  signal?: AbortSignal;
}): Promise<TodoItem> => {
  const raw = await apiClient.put<unknown>(ENDPOINTS.TODOS.UPDATE(id), data, { signal });
  return validateApiResponse(todoResponseSchema, raw);
};

export const deleteTodoRequest = async (
  id: number | string,
  signal?: AbortSignal
): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(ENDPOINTS.TODOS.DELETE(id), { signal });
};

export const updateTodoStatusRequest = async ({
  id,
  isComplete,
  signal,
}: {
  id: number | string;
  isComplete: boolean;
  signal?: AbortSignal;
}): Promise<{ id: number; is_complete: boolean }> => {
  const raw = await apiClient.put<unknown>(
    ENDPOINTS.TODOS.UPDATE_STATUS(id),
    { is_complete: isComplete },
    { signal }
  );
  return validateApiResponse(todoStatusResponseSchema, raw);
};

// Hooks
export const useTodos = () => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.ALL,
    queryFn: ({ signal }) => fetchTodos(signal),
    staleTime: 30 * 1000,
  });
};

export const useTodo = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.DETAIL(id),
    queryFn: ({ signal }) => fetchTodoById(id, signal),
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoCreatePayload) => createTodoRequest(data),
    onSuccess: (newTodo) => {
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.ALL });
      showSuccessToast('Task Created', `"${newTodo.title}" has been added.`);
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Create Task', error.message);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: number | string; data: TodoUpdatePayload }) => updateTodoRequest(args),
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.DETAIL(updatedTodo.id) });
      showSuccessToast('Task Updated', `Changes to "${updatedTodo.title}" saved.`);
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Update Task', error.message);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTodoRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.ALL });
      showSuccessToast('Task Deleted', 'The task has been permanently removed.');
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Delete Task', error.message);
    },
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: number | string; isComplete: boolean }) =>
      updateTodoStatusRequest(args),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.ALL });
      showSuccessToast(
        res.is_complete ? 'Task Completed!' : 'Task Reopened',
        res.is_complete ? 'Great work finishing this task.' : 'Task marked as incomplete.'
      );
    },
    onError: (error: Error) => {
      showErrorToast('Status Update Failed', error.message);
    },
  });
};
