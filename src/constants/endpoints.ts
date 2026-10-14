/**
 * Centralized API Endpoints Configuration
 * Matches FastAPI backend routing structure
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  USERS: {
    CREATE: '/users/create',
    UPDATE: (id: number | string) => `/users/update/${id}`,
    GET_BY_ID: (id: number | string) => `/users/${id}`,
    LIST: '/users/list', // Note: FastAPI users router uses POST /users/list
    UPDATE_STATUS: (id: number | string) => `/users/${id}/status`,
  },
  TODOS: {
    CREATE: '/createtodos',
    LIST: '/todos',
    GET_BY_ID: (id: number | string) => `/todo/${id}`,
    UPDATE: (id: number | string) => `/todo/${id}`,
    DELETE: (id: number | string) => `/todo/${id}`,
    UPDATE_STATUS: (id: number | string) => `/todo/${id}/status`,
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'taskpulse_access_token',
  USER_DATA: 'taskpulse_user_data',
  THEME_MODE: 'taskpulse_theme_mode',
} as const;
