import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../service/apiClient';
import { ENDPOINTS } from '../constants/endpoints';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import {
  userResponseSchema,
  userListResponseSchema,
} from '@/schemas/user';
import { validateApiResponse } from '@/schemas/common';
import type {
  User,
  UserCreatePayload,
  UserUpdatePayload,
} from '@/types/user';

export const USER_QUERY_KEYS = {
  ALL: ['users'] as const,
  DETAIL: (id: number | string) => ['users', id] as const,
};

// Fetchers with Pirai Runtime Validation Contract & Signal Support
export const fetchUsers = async (signal?: AbortSignal): Promise<User[]> => {
  // FastAPI specifies @router.post("/list") for listing users
  const raw = await apiClient.post<unknown>(ENDPOINTS.USERS.LIST, undefined, { signal });
  return validateApiResponse(userListResponseSchema, raw);
};

export const fetchUserById = async (id: number | string, signal?: AbortSignal): Promise<User> => {
  const raw = await apiClient.get<unknown>(ENDPOINTS.USERS.GET_BY_ID(id), { signal });
  return validateApiResponse(userResponseSchema, raw);
};

export const createUserRequest = async (
  data: UserCreatePayload,
  signal?: AbortSignal
): Promise<User> => {
  const raw = await apiClient.post<unknown>(ENDPOINTS.USERS.CREATE, data, { signal });
  return validateApiResponse(userResponseSchema, raw);
};

export const updateUserRequest = async ({
  id,
  data,
  signal,
}: {
  id: number | string;
  data: UserUpdatePayload;
  signal?: AbortSignal;
}): Promise<User> => {
  const raw = await apiClient.put<unknown>(ENDPOINTS.USERS.UPDATE(id), data, { signal });
  return validateApiResponse(userResponseSchema, raw);
};

export const updateUserStatusRequest = async ({
  id,
  isActive,
  signal,
}: {
  id: number | string;
  isActive: boolean;
  signal?: AbortSignal;
}): Promise<User> => {
  const raw = await apiClient.put<unknown>(
    ENDPOINTS.USERS.UPDATE_STATUS(id),
    { is_active: isActive },
    { signal }
  );
  return validateApiResponse(userResponseSchema, raw);
};

// Hooks
export const useUsers = (enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.ALL,
    queryFn: ({ signal }) => fetchUsers(signal),
    enabled,
    staleTime: 60 * 1000,
  });
};

export const useUser = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.DETAIL(id),
    queryFn: ({ signal }) => fetchUserById(id, signal),
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreatePayload) => createUserRequest(data),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL });
      showSuccessToast(
        'User Created Successfully',
        `Account for ${newUser.email} has been provisioned and welcome email dispatched.`
      );
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Create User', error.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: number | string; data: UserUpdatePayload }) => updateUserRequest(args),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.DETAIL(updatedUser.id) });
      showSuccessToast('User Updated', `Changes to ${updatedUser.email} saved successfully.`);
    },
    onError: (error: Error) => {
      showErrorToast('Update Failed', error.message);
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: number | string; isActive: boolean }) =>
      updateUserStatusRequest(args),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL });
      showSuccessToast(
        'Status Changed',
        `User ${user.email} is now ${user.is_active ? 'Active' : 'Inactive'}.`
      );
    },
    onError: (error: Error) => {
      showErrorToast('Status Change Failed', error.message);
    },
  });
};

export const updateUserPreferencesRequest = async (
  preferences: { theme_mode?: 'light' | 'dark' | 'system'; language?: 'en' | 'es' },
  signal?: AbortSignal
): Promise<User> => {
  const raw = await apiClient.put<unknown>(ENDPOINTS.USERS.PREFERENCES, preferences, { signal });
  return validateApiResponse(userResponseSchema, raw);
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: { theme_mode?: 'light' | 'dark' | 'system'; language?: 'en' | 'es' }) =>
      updateUserPreferencesRequest(preferences),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.DETAIL(updatedUser.id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL });
    },
    onError: (error: Error) => {
      console.warn('Failed to sync preferences to backend:', error.message);
    },
  });
};

