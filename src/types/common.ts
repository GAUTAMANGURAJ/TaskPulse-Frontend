/**
 * TaskPulse Enterprise - Application Common & Shared Types
 */

export interface ApiErrorResponse {
  detail?: string | Array<{ msg: string; loc: string[] }>;
  message?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}
