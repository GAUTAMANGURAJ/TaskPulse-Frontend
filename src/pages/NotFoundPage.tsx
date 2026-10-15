import React from 'react';
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { CustomButton } from '../components/custom/CustomButton';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Result
        status="404"
        title={<span className="text-3xl font-extrabold text-theme-title">404</span>}
        subTitle={
          <span className="text-sm text-theme-muted">
            {t('common.pageNotFoundDesc')}
          </span>
        }
        extra={
          <CustomButton
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard')}
          >
            {t('common.backToDashboard')}
          </CustomButton>
        }
      />
    </div>
  );
};
