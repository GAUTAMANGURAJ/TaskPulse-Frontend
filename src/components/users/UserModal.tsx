import React, { useEffect } from 'react';
import { Checkbox, Alert } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser, useUpdateUser } from '../../api/users';
import { useRoleList } from '../../api/roles';
import { useI18n } from '../../i18n/I18nContext';
import {
  CustomButton,
  CustomSelect,
  CustomInput,
  CustomModal,
} from '../custom';
import { createUserSchema, updateUserSchema, getCreateUserSchema } from '@/schemas/user';
import type { User, UserCreatePayload, UserUpdatePayload } from '@/types/user';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  currentUserId?: number;
}

interface FormValues {
  email: string;
  password?: string;
  role_id: number;
  is_active?: boolean;
  is_superuser?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  userToEdit,
  currentUserId,
}) => {
  const { t } = useI18n();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: roles = [], isLoading: isRolesLoading } = useRoleList(open);

  const isEditMode = Boolean(userToEdit);
  const isEditingSelf = Boolean(userToEdit && userToEdit.id === currentUserId);

  const activeSchema = isEditMode ? updateUserSchema : getCreateUserSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(activeSchema as never),
    defaultValues: {
      email: '',
      password: '',
      role_id: undefined as unknown as number,
      is_active: true,
      is_superuser: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        reset({
          email: userToEdit.email,
          password: '',
          role_id: userToEdit.role_id || (undefined as unknown as number),
          is_active: userToEdit.is_active,
          is_superuser: userToEdit.is_superuser,
        });
      } else {
        const defaultRole = roles.find((r) => r.is_active);
        reset({
          email: '',
          password: '',
          role_id: defaultRole ? defaultRole.id : (undefined as unknown as number),
          is_active: true,
          is_superuser: false,
        });
      }
    }
  }, [open, userToEdit, roles, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditMode && userToEdit) {
        const updatePayload: UserUpdatePayload = {
          email: values.email,
          role_id: values.role_id,
          is_active: values.is_active,
          is_superuser: values.is_superuser,
        };
        if (values.password && values.password.trim()) {
          updatePayload.password = values.password;
        }

        await updateUser.mutateAsync({
          id: userToEdit.id,
          data: updatePayload,
        });
      } else {
        const createPayload: UserCreatePayload = {
          email: values.email,
          password: values.password || '',
          role_id: values.role_id,
        };
        await createUser.mutateAsync(createPayload);
      }
      onClose();
    } catch {
      // Errors handled by API toast notifications
    }
  };

  const isPending = createUser.isPending || updateUser.isPending || isFormSubmitting;

  const roleOptions = roles.map((role) => ({
    label: (
      <div className="flex items-center justify-between">
        <span className="font-medium">{role.name}</span>
        <span className="text-[10px] text-theme-muted">
          ({role.permission_count || 0} permissions)
        </span>
      </div>
    ),
    value: role.id,
    disabled: !role.is_active,
  }));

  return (
    <CustomModal
      open={open}
      title={isEditMode ? `${t('users.editUser')}: #${userToEdit?.id}` : t('users.provisionUser')}
      onCancel={onClose}
      showFooter={false}
      destroyOnClose
      centered
      width={520}
      className="enterprise-modal"
    >
      {!isEditMode && (
        <Alert
          message={t('users.autoProvisioningTitle')}
          description={t('users.autoProvisioningDesc')}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="my-3 text-xs rounded-lg"
        />
      )}

      {isEditingSelf && (
        <Alert
          message={t('users.selfEditNoticeTitle')}
          description={t('users.selfEditNoticeDesc')}
          type="warning"
          showIcon
          className="my-3 text-xs rounded-lg"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        {/* Email Address */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              label={t('users.emailAddress')}
              isRequired
              tooltip={t('users.emailTooltip')}
              prefix={<MailOutlined className="text-theme-muted mr-1" />}
              placeholder={t('auth.emailPlaceholder')}
              error={errors.email?.message}
              size="large"
              {...field}
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              label={isEditMode ? t('users.passwordOptional') : t('auth.passwordLabel')}
              isRequired={!isEditMode}
              subLabel={isEditMode ? t('tasks.optionalLabel') : undefined}
              tooltip={t('profile.passwordTooltip')}
              prefix={<LockOutlined className="text-theme-muted mr-1" />}
              placeholder={isEditMode ? '••••••••' : t('auth.passwordPlaceholder')}
              isPassword
              error={errors.password?.message}
              size="large"
              {...field}
            />
          )}
        />

        {/* Mandatory Role Selection */}
        <Controller
          name="role_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label={t('users.role')}
              isRequired
              error={errors.role_id?.message}
              tooltip={t('users.roleTooltip')}
              value={field.value}
              onChange={(val) => field.onChange(val)}
              options={roleOptions}
              loading={isRolesLoading}
              placeholder={t('users.selectRolePlaceholder')}
              size="large"
              suffixIcon={<SafetyCertificateOutlined className="text-theme-muted" />}
            />
          )}
        />

        {/* Active & Superuser Toggles (Edit Mode) */}
        {isEditMode && (
          <div className="space-y-3 pt-2 pb-2">
            <div>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isEditingSelf}
                    className="text-xs font-medium text-theme-body"
                  >
                    {t('users.accountActive')}
                  </Checkbox>
                )}
              />
            </div>

            <div>
              <Controller
                name="is_superuser"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isEditingSelf}
                    className="text-xs font-medium text-theme-body"
                  >
                    {t('users.superAdminRole')}
                  </Checkbox>
                )}
              />
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-theme-divider">
          <CustomButton variant="secondary" onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            loading={isPending}
          >
            {isEditMode ? t('users.saveChanges') : t('users.provisionButton')}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
