import { z } from 'zod';

/**
 * TaskPulse Enterprise - User Management Validation Schemas & Types
 */

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid corporate email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export const userListResponseSchema = z.array(userResponseSchema);
