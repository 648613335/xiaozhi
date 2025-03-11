import React from 'react';
import { Typography } from 'antd';
import '@/assets/global.css';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  return (
    <div className="content-container">
      <Title level={2}>用户管理1</Title>
    </div>
  );
};

export default UsersPage; 