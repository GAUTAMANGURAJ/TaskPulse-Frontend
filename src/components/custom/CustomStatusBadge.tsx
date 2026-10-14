import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CrownOutlined,
  StopOutlined,
} from '@ant-design/icons';

interface CustomStatusBadgeProps {
  type: 'todo_status' | 'user_status' | 'user_role';
  value: boolean;
  text?: string;
}

export const CustomStatusBadge: React.FC<CustomStatusBadgeProps> = ({ type, value, text }) => {
  if (type === 'todo_status') {
    return value ? (
      <Tag
        icon={<CheckCircleOutlined />}
        color="success"
        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      >
        {text || 'Completed'}
      </Tag>
    ) : (
      <Tag
        icon={<ClockCircleOutlined />}
        color="warning"
        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      >
        {text || 'In Progress'}
      </Tag>
    );
  }

  if (type === 'user_status') {
    return value ? (
      <Tag
        icon={<CheckCircleOutlined />}
        color="success"
        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      >
        {text || 'Active'}
      </Tag>
    ) : (
      <Tag
        icon={<StopOutlined />}
        color="error"
        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      >
        {text || 'Inactive'}
      </Tag>
    );
  }

  if (type === 'user_role') {
    return value ? (
      <Tag
        icon={<CrownOutlined />}
        color="purple"
        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      >
        {text || 'Super Admin'}
      </Tag>
    ) : (
      <Tag
        icon={<UserOutlined />}
        color="blue"
        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      >
        {text || 'Standard User'}
      </Tag>
    );
  }

  return null;
};
