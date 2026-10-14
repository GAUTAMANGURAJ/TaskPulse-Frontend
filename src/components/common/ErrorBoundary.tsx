import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TaskPulse Uncaught Runtime Error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <Result
            status="500"
            title={<span className="text-2xl font-bold">Unexpected Application Error</span>}
            subTitle={
              <span className="text-slate-500 text-sm max-w-md block">
                {this.state.error?.message ||
                  'An unexpected system exception occurred. The incident has been recorded in the application console.'}
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
              >
                Reload Application
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
