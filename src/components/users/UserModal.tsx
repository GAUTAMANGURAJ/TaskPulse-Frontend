import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, Alert } from 'antd';
import { MailOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useCreateUser, useUpdateUser } from '../../api/users';
import type { User, UserCreatePayload, UserUpdatePayload } from '@/types/user';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  currentUserId?: number;
}

export const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  userToEdit,
  currentUserId,
}) => {
  const [form] = Form.useForm();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEditMode = Boolean(userToEdit);
  const isEditingSelf = Boolean(userToEdit && userToEdit.id === currentUserId);

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        form.setFieldsValue({
          email: userToEdit.email,
          password: '',
          is_active: userToEdit.is_active,
          is_superuser: userToEdit.is_superuser,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          is_active: true,
          is_superuser: false,
        });
      }
    }
  }, [open, userToEdit, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (isEditMode && userToEdit) {
        const updatePayload: UserUpdatePayload = {
          email: values.email as string,
          is_active: values.is_active as boolean,
          is_superuser: values.is_superuser as boolean,
        };
        if (values.password && typeof values.password === 'string' && values.password.trim()) {
          updatePayload.password = values.password;
        }

        await updateUser.mutateAsync({
          id: userToEdit.id,
          data: updatePayload,
        });
      } else {
        const createPayload: UserCreatePayload = {
          email: values.email as string,
          password: values.password as string,
        };
        await createUser.mutateAsync(createPayload);
      }
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {isEditMode ? `Update User Profile: #${userToEdit?.id}` : 'Provision New System User'}
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={520}
    >
      {!isEditMode && (
        <Alert
          message="Automated Email Notification"
          description="Upon account creation, the FastAPI backend will dispatch an asynchronous welcome email with onboarding information to the recipient."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="my-3 text-xs"
        />
      )}

      {isEditingSelf && (
        <Alert
          message="Account Self-Management Notice"
          description="You are currently editing your own super administrator profile. Self-deactivation and demotion are restricted."
          type="warning"
          showIcon
          className="my-3 text-xs"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Email</span>}
          rules={[
            { required: true, message: 'Corporate email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-slate-400 mr-1" />}
            placeholder="developer@company.com"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isEditMode ? 'New Password (leave blank to keep unchanged)' : 'Initial Password'}
            </span>
          }
          rules={[
            { required: !isEditMode, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-slate-400 mr-1" />}
            placeholder={isEditMode ? 'Leave blank to preserve password' : '••••••••'}
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {isEditMode && (
          <div className="space-y-3 pt-2 pb-4">
            <Form.Item
              name="is_active"
              valuePropName="checked"
              className="m-0"
            >
              <Checkbox
                disabled={isEditingSelf}
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Account Active (grant system access)
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="is_superuser"
              valuePropName="checked"
              className="m-0"
            >
              <Checkbox
                disabled={isEditingSelf}
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Super Administrator (unrestricted RBAC privileges)
              </Checkbox>
            </Form.Item>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            {isEditMode ? 'Save User Changes' : 'Provision User'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
