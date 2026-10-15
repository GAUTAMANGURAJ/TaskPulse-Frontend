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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-canvas)]">
          <Result
            status="500"
            title={<span className="text-2xl font-bold text-theme-title">Unexpected Application Error</span>}
            subTitle={
              <span className="text-theme-muted text-sm max-w-md block">
                {this.state.error?.message ||
                  'An unexpected system exception occurred. The incident has been recorded in the application console.'}
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                className="btn-primary font-semibold"
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
