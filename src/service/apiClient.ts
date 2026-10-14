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

    // 2. Response Interceptor: Error parsing and 401 redirect
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ detail?: string | Array<{ msg: string }>; message?: string }>) => {
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

        // Handle 401 Unauthorized
        if (status === 401) {
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
