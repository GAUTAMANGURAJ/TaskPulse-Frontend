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
  refresh_token: z.string().optional(),
  token_type: z.string().default('bearer'),
  user_id: z.number().int().optional(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;

export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

export const refreshTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().optional(),
  token_type: z.string().default('bearer'),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
