import { z } from 'zod';

/**
 * TaskPulse Enterprise - Authentication Validation Schemas & Types
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid corporate email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().default('bearer'),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
