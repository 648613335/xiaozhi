import React from 'react';
import { Card, Typography, Space, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  // 添加防御性代码，确保所有对象和属性都已定义
  const userCount = 112893;
  const roleCount = 8;
  const moduleCount = 12;

  return (
    <div>
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
            value={userCount}
            prefix={<UserOutlined />}
            formatter={value => <CountUp end={value} duration={2.5} />}
          />
        </Card>
        <Card>
          <Statistic
            title="角色数量"
            value={roleCount}
            prefix={<TeamOutlined />}
            formatter={value => <CountUp end={value} duration={2.5} />}
          />
        </Card>
        <Card>
          <Statistic
            title="系统模块"
            value={moduleCount}
            prefix={<SettingOutlined />}
            formatter={value => <CountUp end={value} duration={2.5} />}
          />
        </Card>
      </Space>
    </div>
  );
};

export default HomePage; 