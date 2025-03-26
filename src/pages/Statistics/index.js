import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  DatePicker,
  Select,
  Tabs,
  Tag,
  Space,
  Progress,
  List,
  Divider
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  RiseOutlined,
  FieldTimeOutlined,
  StarOutlined
} from '@ant-design/icons';
import '@/assets/global.css';
import './statistics.css';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟数据 - 用户活跃度
const userActivityData = [
  { date: '2024-01', activeUsers: 1200, newUsers: 350, sessions: 5600 },
  { date: '2024-02', activeUsers: 1380, newUsers: 290, sessions: 6100 },
  { date: '2024-03', activeUsers: 1680, newUsers: 470, sessions: 7300 },
  { date: '2024-04', activeUsers: 1520, newUsers: 380, sessions: 6800 },
  { date: '2024-05', activeUsers: 1890, newUsers: 510, sessions: 8200 },
  { date: '2024-06', activeUsers: 2100, newUsers: 590, sessions: 9400 },
];

// 模拟数据 - 角色使用分布
const roleUsageData = [
  { type: '智能助手小明', value: 38, color: '#1890ff' },
  { type: '专业顾问小华', value: 25, color: '#13c2c2' },
  { type: '客服机器人', value: 15, color: '#52c41a' },
  { type: '编程教练', value: 12, color: '#faad14' },
  { type: '其他角色', value: 10, color: '#722ed1' },
];

// 模拟数据 - 对话主题分析
const conversationTopicsData = [
  { topic: '技术咨询', count: 3500, color: '#1890ff' },
  { topic: '产品问询', count: 2800, color: '#13c2c2' },
  { topic: '售后支持', count: 2200, color: '#52c41a' },
  { topic: '账户问题', count: 1800, color: '#faad14' },
  { topic: '投诉建议', count: 1200, color: '#722ed1' },
];

// 模拟数据 - 近期对话记录
const recentConversationsData = [
  {
    id: 1,
    userName: '张三',
    roleName: '智能助手小明',
    topic: '技术咨询',
    messageCount: 12,
    duration: '8分钟',
    timeStamp: '2024-06-15 14:30',
    satisfaction: 5,
  },
  {
    id: 2,
    userName: '李四',
    roleName: '专业顾问小华',
    topic: '产品问询',
    messageCount: 8,
    duration: '5分钟',
    timeStamp: '2024-06-15 13:15',
    satisfaction: 4,
  },
  {
    id: 3,
    userName: '王五',
    roleName: '客服机器人',
    topic: '售后支持',
    messageCount: 15,
    duration: '12分钟',
    timeStamp: '2024-06-15 11:42',
    satisfaction: 3,
  },
  {
    id: 4,
    userName: '赵六',
    roleName: '编程教练',
    topic: '技术咨询',
    messageCount: 20,
    duration: '15分钟',
    timeStamp: '2024-06-15 10:20',
    satisfaction: 5,
  },
];

// 模拟数据 - 用户反馈分析
const userFeedbackData = [
  { category: '非常满意', count: 4200, percentage: 42, color: '#52c41a' },
  { category: '满意', count: 3100, percentage: 31, color: '#1890ff' },
  { category: '一般', count: 1800, percentage: 18, color: '#faad14' },
  { category: '不满意', count: 620, percentage: 6.2, color: '#ff4d4f' },
  { category: '非常不满意', count: 280, percentage: 2.8, color: '#cf1322' },
];

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState(['2024-01', '2024-06']);
  const [roleFilter, setRoleFilter] = useState(undefined);

  // 近期对话记录表格列
  const conversationColumns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '主题',
      dataIndex: 'topic',
      key: 'topic',
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '消息数',
      dataIndex: 'messageCount',
      key: 'messageCount',
      sorter: (a, b) => a.messageCount - b.messageCount,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '时间',
      dataIndex: 'timeStamp',
      key: 'timeStamp',
      sorter: (a, b) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (score) => {
        let color = '';
        if (score >= 4) color = 'green';
        else if (score >= 3) color = 'blue';
        else if (score >= 2) color = 'orange';
        else color = 'red';

        return (
          <Tag color={color}>
            {score} 星
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="content-container statistics-page">
      <div className="statistics-header">
        <Title level={2}>统计分析</Title>
        <Space>
          <RangePicker picker="month" />
          <Select
            placeholder="选择角色"
            style={{ width: 180 }}
            allowClear
          >
            <Option value="all">所有角色</Option>
            <Option value="assistant1">智能助手小明</Option>
            <Option value="advisor1">专业顾问小华</Option>
            <Option value="userService">客服机器人</Option>
            <Option value="programmingCoach">编程教练</Option>
          </Select>
        </Space>
      </div>

      {/* 数据概览 */}
      <Row gutter={16} className="stat-card-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={12589}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span className="trend-value">20.5%</span>
              <span className="trend-period">较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={5823}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span className="trend-value">12.3%</span>
              <span className="trend-period">较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="对话总数"
              value={89632}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span className="trend-value">15.8%</span>
              <span className="trend-period">较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value="2.5秒"
              prefix={<FieldTimeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span className="trend-value">8.2%</span>
              <span className="trend-period">较上月</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 用户反馈分析 */}
      <Card title="用户反馈分析" className="feedback-analysis">
        <List
          dataSource={userFeedbackData}
          renderItem={item => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{item.category}</span>
                  <span>{item.count} 次</span>
                </div>
                <Progress
                  percent={item.percentage}
                  strokeColor={item.color}
                  showInfo={false}
                />
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 近期对话记录 */}
      <Card title="近期对话记录" className="recent-conversations">
        <Table
          columns={conversationColumns}
          dataSource={recentConversationsData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default StatisticsPage; 