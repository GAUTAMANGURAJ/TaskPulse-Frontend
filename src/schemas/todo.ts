import { z } from 'zod';

/**
 * TaskPulse Enterprise - Todo / Task Management Validation Schemas & Types
 */

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .nullable()
    .optional()
    .or(z.literal('')),
  is_complete: z.boolean(),
});

export type TodoFormData = z.infer<typeof todoSchema>;

export const todoResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable().optional(),
  is_complete: z.boolean(),
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
export const todoListResponseSchema = z.array(todoResponseSchema);

export const todoStatusResponseSchema = z.object({
  id: z.number().int(),
  is_complete: z.boolean(),
});

export type TodoStatusResponse = z.infer<typeof todoStatusResponseSchema>;
