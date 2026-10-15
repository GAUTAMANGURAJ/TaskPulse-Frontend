/**
 * TaskPulse Enterprise - User Management Type Definitions
 */

export interface User {
  id: number;
  email: string;
  role_id?: number | null;
  role_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  theme_mode?: 'light' | 'dark' | 'system' | null;
  language?: string | null;
}

export interface UserPreferencesPayload {
  theme_mode?: 'light' | 'dark' | 'system' | null;
  language?: string | null;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  role_id: number;
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  role_id?: number | null;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserStatusUpdatePayload {
  is_active: boolean;
}
