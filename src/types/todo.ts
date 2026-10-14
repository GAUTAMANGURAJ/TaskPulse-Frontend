/**
 * TaskPulse Enterprise - Todo / Task Management Type Definitions
 */

export interface TodoItem {
  id: number;
  title: string;
  description?: string | null;
  is_complete: boolean;
}

export interface TodoCreatePayload {
  title: string;
  description?: string | null;
  is_complete?: boolean;
}

export interface TodoUpdatePayload {
  title: string;
  description?: string | null;
  is_complete?: boolean;
}

export interface TodoStatusUpdatePayload {
  is_complete: boolean;
}
