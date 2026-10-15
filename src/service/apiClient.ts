import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosHeaders,
  AxiosError,
} from 'axios';
import { storage } from '../utils/storage';
import { showErrorToast } from '../utils/toast';

let isRedirectingToLogin = false;

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    // In development with Vite proxy, use '/api', which rewrites to http://localhost:8000
    // In production, fallback to VITE_API_URL or '/api'
    const baseURL = import.meta.env.VITE_API_URL || '/api';

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 15000,
    });

    // 1. Request Interceptor: Attach JWT Bearer Token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = storage.getToken();
        const headers = AxiosHeaders.from(config.headers);

        if (token && !config.url?.includes('/auth/login')) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        // Special handling for OAuth2 password form login
        if (config.url?.includes('/auth/login') && config.method?.toLowerCase() === 'post') {
          headers.set('Content-Type', 'application/x-www-form-urlencoded');
        } else if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }

        config.headers = headers;
        return config;
      },
      (error) => Promise.reject(error)
    );

    let isRefreshing = false;
    let failedQueue: Array<{
      resolve: (token: string) => void;
      reject: (error: Error) => void;
    }> = [];

    const processQueue = (error: Error | null, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else if (token) {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    // 2. Response Interceptor: Error parsing and silent token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ detail?: string | Array<{ msg: string }>; message?: string }>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const data = error.response?.data;

        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (data?.detail) {
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail) && data.detail.length > 0) {
            errorMessage = data.detail.map((d) => d.msg).join(', ');
          }
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Handle 401 Unauthorized with Refresh Token
        if (status === 401 && originalRequest && !originalRequest._retry) {
          const isAuthUrl =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refreshToken');

          if (!isAuthUrl) {
            const refreshToken = storage.getRefreshToken();

            if (refreshToken) {
              if (isRefreshing) {
                // Another refresh is in flight, queue this request
                return new Promise((resolve, reject) => {
                  failedQueue.push({
                    resolve: (token: string) => {
                      if (!originalRequest.headers) {
                        originalRequest.headers = {};
                      }
                      originalRequest.headers['Authorization'] = `Bearer ${token}`;
                      resolve(this.axiosInstance(originalRequest));
                    },
                    reject: (err: Error) => reject(err),
                  });
                });
              }

              originalRequest._retry = true;
              isRefreshing = true;

              try {
                // Call refresh endpoint directly using raw axios to bypass interceptor loop
                const baseURL = import.meta.env.VITE_API_URL || '/api';
                const refreshResponse = await axios.post<{
                  access_token: string;
                  refresh_token?: string;
                  token_type: string;
                }>(
                  `${baseURL}/auth/refreshToken`,
                  { refresh_token: refreshToken },
                  { headers: { 'Content-Type': 'application/json' } }
                );

                const newAccessToken = refreshResponse.data.access_token;
                const newRefreshToken = refreshResponse.data.refresh_token;

                storage.setToken(newAccessToken);
                if (newRefreshToken) {
                  storage.setRefreshToken(newRefreshToken);
                }

                processQueue(null, newAccessToken);

                if (!originalRequest.headers) {
                  originalRequest.headers = {};
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return this.axiosInstance(originalRequest);
              } catch (refreshErr) {
                processQueue(refreshErr instanceof Error ? refreshErr : new Error('Token refresh failed'), null);
                storage.clearAuth();
                if (!window.location.pathname.includes('/login') && !isRedirectingToLogin) {
                  isRedirectingToLogin = true;
                  showErrorToast('Session Expired', 'Please log in again to continue.');
                  setTimeout(() => {
                    window.location.href = '/login';
                    isRedirectingToLogin = false;
                  }, 800);
                }
                return Promise.reject(new Error('Session expired. Please log in again.'));
              } finally {
                isRefreshing = false;
              }
            }
          }

          // If no refresh token or auth URL failed
          if (!window.location.pathname.includes('/login') && !isRedirectingToLogin) {
            isRedirectingToLogin = true;
            storage.clearAuth();
            showErrorToast('Session Expired', 'Please log in again to continue.');
            setTimeout(() => {
              window.location.href = '/login';
              isRedirectingToLogin = false;
            }, 800);
          }
        }

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.axiosInstance.get<T>(url, config);
    return res.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.axiosInstance.post<T>(url, data, config);
    return res.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.axiosInstance.put<T>(url, data, config);
    return res.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.axiosInstance.delete<T>(url, config);
    return res.data;
  }
}

export const apiClient = ApiClient.getInstance();
