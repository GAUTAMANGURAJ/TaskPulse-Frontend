import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../service/apiClient';
import { ENDPOINTS } from '../constants/endpoints';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import type {
  Role,
  UserPermissionsData,
  CreateRolePayload,
  AssignPermissionsPayload,
  RoleStatusPayload,
} from '../types/role';

export const ROLES_QUERY_KEYS = {
  LIST: ['roles', 'list'] as const,
  PERMISSIONS: (userId?: number | string) => ['roles', 'permissions', userId] as const,
};

// Raw API Fetchers
export const fetchUserPermissions = async (
  userId?: number,
  signal?: AbortSignal
): Promise<UserPermissionsData> => {
  const url = userId
    ? `${ENDPOINTS.ROLES.USER_PERMISSIONS}?userId=${userId}`
    : ENDPOINTS.ROLES.USER_PERMISSIONS;
  return apiClient.get<UserPermissionsData>(url, { signal });
};

export const fetchRoleList = async (signal?: AbortSignal): Promise<Role[]> => {
  return apiClient.get<Role[]>(ENDPOINTS.ROLES.LIST, { signal });
};

export const createRoleApi = async (
  payload: CreateRolePayload,
  signal?: AbortSignal
): Promise<Role> => {
  return apiClient.post<Role>(ENDPOINTS.ROLES.CREATE, payload, { signal });
};

export const assignPermissionsApi = async (
  payload: AssignPermissionsPayload,
  signal?: AbortSignal
): Promise<{ message: string; status: boolean; result: number }> => {
  return apiClient.post<{ message: string; status: boolean; result: number }>(
    ENDPOINTS.ROLES.ADD_PERMISSIONS,
    payload,
    { signal }
  );
};

export const updateRoleStatusApi = async (
  roleId: number,
  payload: RoleStatusPayload,
  signal?: AbortSignal
): Promise<{ message: string; status: boolean }> => {
  return apiClient.put<{ message: string; status: boolean }>(
    ENDPOINTS.ROLES.STATUS(roleId),
    payload,
    { signal }
  );
};

// React Query Hooks
export const useUserPermissionsQuery = (userId?: number, enabled = true) => {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.PERMISSIONS(userId),
    queryFn: ({ signal }) => fetchUserPermissions(userId, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoleList = (enabled = true) => {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.LIST,
    queryFn: ({ signal }) => fetchRoleList(signal),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRoleApi(payload),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.LIST });
      showSuccessToast('Role Created', `Role "${newRole.name}" was successfully registered.`);
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Create Role', error.message);
    },
  });
};

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignPermissionsPayload) => assignPermissionsApi(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.LIST });
      queryClient.invalidateQueries({ queryKey: ['roles', 'permissions'] });
      showSuccessToast('Permissions Updated', response.message || 'Permissions assigned successfully.');
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Assign Permissions', error.message);
    },
  });
};

export const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, is_active }: { roleId: number; is_active: boolean }) =>
      updateRoleStatusApi(roleId, { is_active }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.LIST });
      showSuccessToast('Status Updated', response.message || 'Role status successfully updated.');
    },
    onError: (error: Error) => {
      showErrorToast('Failed to Update Status', error.message);
    },
  });
};
