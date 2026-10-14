import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export const Footer: React.FC = () => {
  return (
    <AntFooter className="text-center py-4 text-xs text-slate-400 bg-transparent">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} TaskPulse Enterprise. All rights reserved.</span>
        <span className="hidden sm:inline">•</span>
        <span>Secured with JWT & Role-Based Access Control</span>
        <span className="hidden sm:inline">•</span>
        <span className="font-mono text-[11px] text-indigo-500">v1.0.0-prod</span>
      </div>
    </AntFooter>
  );
};
