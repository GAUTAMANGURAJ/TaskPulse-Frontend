import React, { useEffect } from 'react';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole } from '../../api/roles';
import { useI18n } from '../../i18n/I18nContext';
import {
  CustomButton,
  CustomInput,
  CustomSelect,
  CustomTextarea,
  CustomDrawer,
} from '../custom';
import { getCreateRoleSchema, type CreateRoleFormData } from '../../schemas/role';
import type { Role } from '../../types/role';

interface AddRoleDrawerProps {
  open: boolean;
  onClose: () => void;
  roleToEdit?: Role | null;
}

export const AddRoleDrawer: React.FC<AddRoleDrawerProps> = ({
  open,
  onClose,
  roleToEdit,
}) => {
  const { t } = useI18n();
  const createRole = useCreateRole();
  const isEditMode = Boolean(roleToEdit);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(getCreateRoleSchema(t)),
    defaultValues: {
      name: '',
      description: '',
      role_type: 'Internal',
      permission_ids: [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      if (roleToEdit) {
        reset({
          name: roleToEdit.name,
          description: roleToEdit.description || '',
          role_type: roleToEdit.role_type || 'Internal',
          permission_ids: [],
        });
      } else {
        reset({
          name: '',
          description: '',
          role_type: 'Internal',
          permission_ids: [],
        });
      }
    }
  }, [open, roleToEdit, reset]);

  const onSubmit = async (values: CreateRoleFormData) => {
    try {
      await createRole.mutateAsync({
        name: values.name,
        description: values.description || null,
        role_type: values.role_type,
        is_active: true,
      });
      onClose();
    } catch {
      // Handled by API error toast
    }
  };

  const isPending = createRole.isPending || isSubmitting;

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      width={480}
      titleText={
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-theme-accent" />
          <span>
            {isEditMode
              ? t('roles.editRole')
              : t('roles.addRole')}
          </span>
        </span>
      }
      subtitleText={isEditMode ? 'Configure operational role parameters' : 'Define new operational role identity'}
      footerContent={
        <div className="flex items-center justify-end gap-2.5">
          <CustomButton variant="secondary" size="md" onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            size="md"
            loading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isEditMode
              ? t('users.saveChanges')
              : t('roles.saveRole')}
          </CustomButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Role Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label={t('roles.roleName')}
              isRequired
              error={errors.name?.message}
              placeholder={t('roles.roleNamePlaceholder')}
              maxLength={50}
            />
          )}
        />

        {/* Role Type */}
        <Controller
          name="role_type"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label={t('roles.roleType')}
              isRequired
              error={errors.role_type?.message}
              tooltip={t('roles.roleTypeTooltip')}
              value={field.value}
              onChange={(val) => field.onChange(val)}
              options={[
                { label: 'Internal Operations', value: 'Internal' },
                { label: 'Administrative Governance', value: 'ADMIN' },
                { label: 'External / Auditor', value: 'External' },
              ]}
            />
          )}
        />

        {/* Role Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CustomTextarea
              {...field}
              label={t('roles.description')}
              error={errors.description?.message}
              tooltip={t('roles.descriptionTooltip')}
              rows={3}
              maxLength={255}
              showCount
              placeholder={t('roles.descriptionPlaceholder')}
            />
          )}
        />
      </form>
    </CustomDrawer>
  );
};
