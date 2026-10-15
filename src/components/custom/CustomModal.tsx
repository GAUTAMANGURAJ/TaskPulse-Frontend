import React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import { CustomButton } from './CustomButton';
import { useI18n } from '../../i18n/I18nContext';

export interface CustomModalProps extends ModalProps {
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm?: () => void;
  showFooter?: boolean;
  destructive?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  children,
  open,
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
  confirmLoading = false,
  showFooter = false,
  destructive = false,
  title,
  ...props
}) => {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        title ? (
          <div className="text-base font-bold text-theme-title pb-1">
            {title}
          </div>
        ) : null
      }
      footer={
        showFooter ? (
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-theme-divider">
            <CustomButton
              variant="secondary"
              size="md"
              onClick={onCancel as React.MouseEventHandler<HTMLButtonElement>}
              disabled={confirmLoading}
            >
              {cancelText || t('common.cancel')}
            </CustomButton>
            <CustomButton
              variant={destructive ? 'danger' : 'primary'}
              size="md"
              loading={confirmLoading}
              onClick={onConfirm}
            >
              {confirmText || t('common.save')}
            </CustomButton>
          </div>
        ) : null
      }
      wrapClassName="backdrop-blur-xs"
      className="enterprise-modal"
      centered
      {...props}
    >
      <div className="pt-2">{children}</div>
    </Modal>
  );
};
