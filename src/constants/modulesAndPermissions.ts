/**
 * Centralized RBAC Module, Sub-Module, and Permission Constants
 * Matches the FastAPI backend hierarchical DTO definitions
 */
export const MODULES = {
  USER_MANAGEMENT: 'User Management',
  ROLES_MANAGEMENT: 'Roles Management',
  TASKS_MANAGEMENT: 'Tasks Management',
} as const;

export const SUB_MODULES = {
  USER_MANAGEMENT: 'User Management',
  ROLES_MANAGEMENT: 'Roles Management',
  TASKS_MANAGEMENT: 'Tasks Management',
} as const;

export const PERMISSIONS = {
  USER_MANAGEMENT: {
    LIST: 'List User',
    CREATE: 'Create User',
    UPDATE: 'Update User',
    DELETE: 'Delete User',
  },
  ROLES_MANAGEMENT: {
    LIST: 'List Role',
    CREATE: 'Create Role',
    UPDATE: 'Update Role',
    STATUS_UPDATE: 'Status Update Role',
    ASSIGN_PERMISSIONS: 'Assign Permissions',
  },
  TASKS_MANAGEMENT: {
    LIST: 'List Tasks',
    CREATE: 'Create Task',
    UPDATE: 'Update Task',
    DELETE: 'Delete Task',
  },
} as const;
