import { z } from 'zod';
import { validations } from '../constants/validationPatterns';
import { fieldMaxLength } from '../constants/maxlimit';

/**
 * TaskPulse Enterprise - Role Validation Schemas
 * Strictly follows Robolab enterprise schema standards and regex validations
 */

// Matches Robolab validations.validName: must contain at least one letter
export const VALID_ROLE_NAME_REGEX = validations.validName;

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(fieldMaxLength.roleNameMinLength, 'Role name must be at least 2 characters')
    .max(fieldMaxLength.roleName, 'Role name cannot exceed 100 characters')
    .regex(validations.validName, 'Role name must contain at least one letter'),
  description: z
    .string()
    .trim()
    .max(fieldMaxLength.roleDescription, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  role_type: z.string().min(1, 'Role classification is required'),
  permission_ids: z.array(z.number()),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export const getCreateRoleSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(fieldMaxLength.roleNameMinLength, t('rolesAndPermissionsModule.addRole.roleValidation'))
      .max(fieldMaxLength.roleName, t('roles.roleNameTooltip'))
      .regex(validations.validName, t('rolesAndPermissionsModule.addRole.invalidRoleName')),
    description: z
      .string()
      .trim()
      .max(fieldMaxLength.roleDescription, t('roles.descriptionTooltip'))
      .optional()
      .or(z.literal('')),
    role_type: z.string().min(1, t('rolesAndPermissionsModule.addRole.roleTypeValidation')),
    permission_ids: z.array(z.number()),
  });

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(fieldMaxLength.roleNameMinLength, 'Role name must be at least 2 characters')
    .max(fieldMaxLength.roleName, 'Role name cannot exceed 100 characters')
    .regex(validations.validName, 'Role name must contain at least one letter')
    .optional(),
  description: z
    .string()
    .trim()
    .max(fieldMaxLength.roleDescription, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  role_type: z.string().optional(),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

export const assignPermissionsSchema = z.object({
  role_id: z.number().int().min(1, 'Valid Role ID required'),
  permission_ids: z.array(z.number().int()),
});

export type AssignPermissionsFormData = z.infer<typeof assignPermissionsSchema>;
