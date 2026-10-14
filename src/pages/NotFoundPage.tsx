import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Result
        status="404"
        title={<span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">404</span>}
        subTitle={
          <span className="text-sm text-slate-500 dark:text-slate-400">
            The page you requested does not exist or has been relocated within the enterprise console.
          </span>
        }
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};
