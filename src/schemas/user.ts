import { z } from 'zod';
import { validations } from '../constants/validationPatterns';
import { fieldMaxLength } from '../constants/maxlimit';

/**
 * TaskPulse Enterprise - User Management Validation Schemas & Types
 * Aligned with Robolab usersSchema enterprise standards
 */

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(fieldMaxLength.nameMinLength, 'Email is required')
    .max(fieldMaxLength.email, 'Email cannot exceed 100 characters')
    .regex(validations.email, 'Please enter a valid corporate email'),
  password: z
    .string()
    .min(fieldMaxLength.passwordMin, 'Password must be at least 6 characters')
    .max(fieldMaxLength.passwordMax, 'Password cannot exceed 128 characters'),
  role_id: z
    .number({ message: 'Role selection is mandatory' })
    .min(1, 'Role selection is mandatory'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const getCreateUserSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(fieldMaxLength.nameMinLength, t('internalUserModule.addUser.emailMandatory'))
      .max(fieldMaxLength.email, t('internalUserModule.addUser.emailMaxLengthValidation'))
      .regex(validations.email, t('internalUserModule.addUser.emailValidation')),
    password: z
      .string()
      .min(fieldMaxLength.passwordMin, t('internalUserModule.addUser.passwordMinLengthValidation'))
      .max(fieldMaxLength.passwordMax, t('internalUserModule.addUser.passwordValidation')),
    role_id: z
      .number({ message: t('internalUserModule.addUser.roleValidation') })
      .min(1, t('internalUserModule.addUser.roleValidation')),
  });

export const updateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .max(fieldMaxLength.email)
    .regex(validations.email, 'Please enter a valid email')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(fieldMaxLength.passwordMin, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  role_id: z.number().min(1).optional().nullable(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  role_id: z.number().int().nullable().optional(),
  role_name: z.string().nullable().optional(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  theme_mode: z.enum(['light', 'dark', 'system']).nullable().optional(),
  language: z.string().nullable().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export const userListResponseSchema = z.array(userResponseSchema);
