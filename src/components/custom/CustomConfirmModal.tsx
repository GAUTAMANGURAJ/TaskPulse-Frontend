import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { CustomButton } from './CustomButton';

export interface CustomConfirmModalProps {
  open: boolean;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * TaskPulse Enterprise - Standardized Confirmation Modal Component
 * Directly models Robolab CustomDialog/UserStatusModal for status toggles and destructive actions.
 */
export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
  icon,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={!loading}
      centered
      width={420}
      className="enterprise-modal"
    >
      <div className="p-4 text-center space-y-4">
        <div className="flex justify-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              danger
                ? 'badge-pill-danger'
                : 'badge-pill-warning'
            }`}
          >
            {icon || <ExclamationCircleFilled />}
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-theme-title">
            {title}
          </h3>
          <p className="text-xs text-theme-muted leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <CustomButton
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </CustomButton>

          <CustomButton
            variant={danger ? 'danger' : 'primary'}
            size="md"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
