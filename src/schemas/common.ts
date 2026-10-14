import { z } from 'zod';

/**
 * TaskPulse Enterprise - Runtime Contract Validator
 * Validates backend responses against Zod contract schemas at the boundary.
 * Protects UI from schema drift and throws deterministic contract errors.
 */
export function validateApiResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('API Response Contract Validation Failure:', result.error.format());
    throw new Error('API Contract Mismatch: The server returned an unexpected response format.');
  }
  return result.data;
}
