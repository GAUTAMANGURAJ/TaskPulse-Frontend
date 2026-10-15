/**
 * Centralized API Endpoints Configuration
 * Matches FastAPI backend routing structure
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refreshToken',
  },
  ROLES: {
    USER_PERMISSIONS: '/role/userPermissions',
    LIST: '/role/list',
    CREATE: '/role',
    ADD_PERMISSIONS: '/role/addPermissions',
    STATUS: (roleId: number | string) => `/role/status?role_id=${roleId}`,
  },
  USERS: {
    CREATE: '/users/create',
    UPDATE: (id: number | string) => `/users/update/${id}`,
    GET_BY_ID: (id: number | string) => `/users/${id}`,
    LIST: '/users/list', // Note: FastAPI users router uses POST /users/list
    UPDATE_STATUS: (id: number | string) => `/users/${id}/status`,
    PREFERENCES: '/users/preferences',
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
  REFRESH_TOKEN: 'taskpulse_refresh_token',
  USER_ID: 'taskpulse_user_id',
  THEME_MODE: 'taskpulse_theme_mode',
  LANGUAGE: 'taskpulse_language',
} as const;
