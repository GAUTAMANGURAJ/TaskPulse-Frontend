import { message, notification } from 'antd';

/**
 * Enterprise Toast & Notification Utility
 * Provides uniform user feedback across the application
 */
export const showSuccessToast = (content: string, description?: string) => {
  if (description) {
    notification.success({
      message: content,
      description,
      placement: 'topRight',
      duration: 3,
    });
  } else {
    message.success(content, 2.5);
  }
};

export const showErrorToast = (content: string, description?: string) => {
  if (description) {
    notification.error({
      message: content,
      description,
      placement: 'topRight',
      duration: 4,
    });
  } else {
    message.error(content, 3.5);
  }
};

export const showInfoToast = (content: string, description?: string) => {
  if (description) {
    notification.info({
      message: content,
      description,
      placement: 'topRight',
      duration: 3,
    });
  } else {
    message.info(content, 2.5);
  }
};

export const showWarningToast = (content: string, description?: string) => {
  if (description) {
    notification.warning({
      message: content,
      description,
      placement: 'topRight',
      duration: 3.5,
    });
  } else {
    message.warning(content, 3);
  }
};
