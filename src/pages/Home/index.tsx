import React from 'react';
import { Card, Typography, Space, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import '@/assets/global.css';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div className="content-container">
      <Typography>
        <Title level={2}>欢迎使用后台管理系统</Title>
        <Paragraph>
          这是一个基于 Umi 和 Ant Design 开发的后台管理系统
        </Paragraph>
      </Typography>

      <Space size="large" style={{ marginTop: 24 }}>
        <Card>
          <Statistic
            title="用户总数"
            value={112893}
            prefix={<UserOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="角色数量"
            value={8}
            prefix={<TeamOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="系统模块"
            value={12}
            prefix={<SettingOutlined />}
          />
        </Card>
      </Space>
    </div>
  );
};

export default HomePage; 