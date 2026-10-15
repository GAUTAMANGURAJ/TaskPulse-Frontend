import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../service/apiClient';
import { ENDPOINTS } from '../constants/endpoints';
import { storage } from '../utils/storage';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import {
  tokenResponseSchema,
  refreshTokenResponseSchema,
  type LoginFormData,
} from '@/schemas/auth';
import { userResponseSchema } from '@/schemas/user';
import { validateApiResponse } from '@/schemas/common';
import type { User } from '@/types/user';
import type { AuthTokenResponse, RefreshTokenResponse } from '@/types/auth';

export const AUTH_QUERY_KEYS = {
  ME: ['auth', 'me'] as const,
};

// Raw Fetchers with Runtime Contract Validation & Cancellation
export const loginRequest = async (
  data: LoginFormData,
  signal?: AbortSignal
): Promise<AuthTokenResponse> => {
  const formPayload = new URLSearchParams();
  formPayload.append('username', data.email);
  formPayload.append('password', data.password);

  const raw = await apiClient.post<unknown>(ENDPOINTS.AUTH.LOGIN, formPayload, { signal });
  return validateApiResponse(tokenResponseSchema, raw);
};

export const refreshTokenRequest = async (
  refreshToken: string,
  signal?: AbortSignal
): Promise<RefreshTokenResponse> => {
  const raw = await apiClient.post<unknown>(
    ENDPOINTS.AUTH.REFRESH_TOKEN,
    { refresh_token: refreshToken },
    { signal }
  );
  return validateApiResponse(refreshTokenResponseSchema, raw);
};

export const fetchMyProfile = async (signal?: AbortSignal): Promise<User> => {
  const raw = await apiClient.get<unknown>(ENDPOINTS.AUTH.ME, { signal });
  return validateApiResponse(userResponseSchema, raw);
};

export interface LogoutResponse {
  message: string;
  status: string;
}

export const logoutRequest = async (signal?: AbortSignal): Promise<LogoutResponse> => {
  return apiClient.post<LogoutResponse>(ENDPOINTS.AUTH.LOGOUT, {}, { signal });
};

// React Query Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => loginRequest(data),
    onSuccess: (response) => {
      storage.setToken(response.access_token);
      if (response.refresh_token) {
        storage.setRefreshToken(response.refresh_token);
      }
      if (response.user_id) {
        storage.setUserId(response.user_id);
      }
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
      showSuccessToast('Welcome back!', 'Authentication successful.');
    },
    onError: (error: Error) => {
      showErrorToast('Login Failed', error.message);
    },
  });
};

export const useMyProfile = (enabled = true) => {
  const token = storage.getToken();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ME,
    queryFn: ({ signal }) => fetchMyProfile(signal),
    enabled: Boolean(token) && enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
