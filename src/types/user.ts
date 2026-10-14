/**
 * TaskPulse Enterprise - User Management Type Definitions
 */

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserStatusUpdatePayload {
  is_active: boolean;
}
