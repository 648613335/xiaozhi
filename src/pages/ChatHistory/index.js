import React, { useState } from 'react';
import { Card, List, Tag, Typography, Input, DatePicker, Select, Space, Button, Avatar, Drawer, Divider, Form, Pagination } from 'antd';
import { C_Table, C_Form } from '@/components';
import { UserOutlined, RobotOutlined, SearchOutlined, FilterOutlined, EyeOutlined, TeamOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons';
import '@/assets/global.css';
import './chatHistory.css';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟聊天记录数据
const mockChatData = [
  {
    id: 1001,
    userId: 'u12345',
    userName: '张三',
    userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    assistantId: 1,
    assistantName: '智能助手小明',
    assistantAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    messages: [
      {
        id: 1,
        content: '你好，我想了解一下关于人工智能的基础知识',
        sender: 'user',
        timestamp: '2024-06-15 14:30:10'
      },
      {
        id: 2,
        content: '你好！很高兴为你介绍人工智能的基础知识。人工智能(AI)是指由人创造的、模拟人类智能的系统或机器，能够执行通常需要人类智能才能完成的任务。...',
        sender: 'assistant',
        timestamp: '2024-06-15 14:30:25'
      },
      {
        id: 3,
        content: '人工智能主要分为哪几种类型？',
        sender: 'user',
        timestamp: '2024-06-15 14:31:05'
      },
      {
        id: 4,
        content: '人工智能可以分为三种主要类型：\n1. 狭义人工智能(ANI)：专注于执行特定任务的AI，如语音助手、推荐系统等。\n2. 通用人工智能(AGI)：具有像人类一样理解、学习和应用知识到各种任务的能力。\n3. 超级人工智能(ASI)：理论上超越人类所有智能的系统。',
        sender: 'assistant',
        timestamp: '2024-06-15 14:31:40'
      },
    ],
    startTime: '2024-06-15 14:30:00',
    endTime: '2024-06-15 14:40:00',
    duration: '10分钟',
    topic: '人工智能知识',
    messageCount: 8
  },
  {
    id: 1002,
    userId: 'u23456',
    userName: '李四',
    userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    assistantId: 2,
    assistantName: '专业顾问小华',
    assistantAvatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
    messages: [
      {
        id: 1,
        content: '你好，我想咨询一下如何优化我的网站性能',
        sender: 'user',
        timestamp: '2024-06-15 15:20:10'
      },
      {
        id: 2,
        content: '你好！网站性能优化是一个很好的话题。有几个关键方面可以考虑：\n1. 减少HTTP请求数量\n2. 优化图片大小和格式\n3. 使用内容分发网络(CDN)\n4. 启用浏览器缓存\n5. 最小化CSS和JavaScript文件\n我们可以从哪一方面开始深入讨论？',
        sender: 'assistant',
        timestamp: '2024-06-15 15:20:40'
      },
    ],
    startTime: '2024-06-15 15:20:00',
    endTime: '2024-06-15 15:35:00',
    duration: '15分钟',
    topic: '网站性能优化',
    messageCount: 12
  },
  {
    id: 1003,
    userId: 'u34567',
    userName: '王五',
    userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    assistantId: 3,
    assistantName: '客服机器人',
    assistantAvatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
    messages: [
      {
        id: 1,
        content: '我购买的产品有问题，需要退款',
        sender: 'user',
        timestamp: '2024-06-16 09:10:05'
      },
      {
        id: 2,
        content: '您好，很抱歉给您带来不便。请问您购买的是什么产品？您能描述一下产品问题吗？',
        sender: 'assistant',
        timestamp: '2024-06-16 09:10:25'
      },
    ],
    startTime: '2024-06-16 09:10:00',
    endTime: '2024-06-16 09:25:00',
    duration: '15分钟',
    topic: '产品退款',
    messageCount: 10
  },
  {
    id: 1004,
    userId: 'u45678',
    userName: '赵六',
    userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    assistantId: 4,
    assistantName: '编程教练',
    assistantAvatar: 'https://randomuser.me/api/portraits/lego/4.jpg',
    messages: [
      {
        id: 1,
        content: '我想学习React，应该从哪里开始？',
        sender: 'user',
        timestamp: '2024-06-16 13:50:10'
      },
      {
        id: 2,
        content: '学习React是个很好的选择！以下是我建议的学习路径：\n\n1. 首先确保你有HTML、CSS和JavaScript的基础知识\n2. 学习现代JavaScript特性（ES6+）\n3. 了解React的核心概念：组件、JSX、状态和属性\n4. 尝试创建简单的React应用\n5. 学习React Router进行导航\n6. 了解状态管理（如Redux或Context API）\n\n你可以从React官方文档开始，它非常全面且对初学者友好。你当前的JavaScript水平如何？',
        sender: 'assistant',
        timestamp: '2024-06-16 13:51:30'
      },
    ],
    startTime: '2024-06-16 13:50:00',
    endTime: '2024-06-16 14:20:00',
    duration: '30分钟',
    topic: 'React学习',
    messageCount: 18
  },
  {
    id: 1005,
    userId: 'u56789',
    userName: '孙七',
    userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    assistantId: 1,
    assistantName: '智能助手小明',
    assistantAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    messages: [
      {
        id: 1,
        content: '推荐几本科幻小说吧',
        sender: 'user',
        timestamp: '2024-06-17 10:30:05'
      },
      {
        id: 2,
        content: '当然可以！以下是几本广受好评的科幻小说推荐：\n\n1. 《三体》 - 刘慈欣的硬科幻杰作，讲述人类与外星文明的接触\n2. 《基地》系列 - 阿西莫夫的经典之作，描绘了一个庞大的银河帝国\n3. 《银河系漫游指南》 - 道格拉斯·亚当斯的幽默科幻小说\n4. 《神经漫游者》 - 威廉·吉布森的赛博朋克开山之作\n5. 《沙丘》 - 弗兰克·赫伯特创造的宏大宇宙史诗\n\n你对哪种类型的科幻更感兴趣？硬科幻、太空歌剧还是近未来类型？',
        sender: 'assistant',
        timestamp: '2024-06-17 10:30:55'
      },
    ],
    startTime: '2024-06-17 10:30:00',
    endTime: '2024-06-17 10:45:00',
    duration: '15分钟',
    topic: '科幻小说推荐',
    messageCount: 6
  }
];

const ChatHistoryPage = () => {
  const [loading, setLoading] = useState(false); // 加载状态
  const [dataSource, setDataSource] = useState([]); // 表格数据源
  const [modalVisible, setModalVisible] = useState(false); // 模态框显示状态
  const [editing, setEditing] = useState(null);
  const [searchForm] = Form.useForm(); // 搜索表单实例
  const [editform] = Form.useForm(); // 编辑表单实例
  const [verificationForm] = Form.useForm(); // 验证码表单实例

  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);

  // 处理查看对话详情
  const handleViewDetail = (record) => {
    setCurrentChat(record);
    setDetailVisible(true);
  };

  // 处理筛选
  const handleSearch = () => {
    // 实际应用中这里会调用API进行筛选
    console.log('搜索条件：', {
      searchText,
      dateRange,
      selectedRole
    });
  };

  // 处理重置
  const handleReset = () => {
    setSearchText('');
    setDateRange(null);
    setSelectedRole('');
  };

  return (
    <div className="content-container chat-history-page">
      <div className="chat-history-header">
        <Title level={2}>聊天记录</Title>
        <div className="filter-container">
          <Space size="middle">
            <Input
              placeholder="搜索关键词"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <RangePicker
              value={dateRange}
              onChange={value => setDateRange(value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="选择角色"
              value={selectedRole}
              onChange={value => setSelectedRole(value)}
              style={{ width: 150 }}
            >
              <Option value="">全部</Option>
              <Option value="user">用户</Option>
              <Option value="assistant">助手</Option>
            </Select>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch}>
              筛选
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>
      </div>

      <Card className="chat-history-content">
        <List
          dataSource={mockChatData}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(item)}
                >
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Space>
                    <Avatar src={item.userAvatar} icon={<UserOutlined />} />
                    <Avatar src={item.assistantAvatar} icon={<RobotOutlined />} />
                  </Space>
                }
                title={
                  <Space>
                    <Text strong>{item.topic || '未命名对话'}</Text>
                    <Tag color="blue">{item.messageCount} 条消息</Tag>
                  </Space>
                }
                description={
                  <Space split={<Divider type="vertical" />}>
                    <Space>
                      <TeamOutlined />
                      <Text type="secondary">{item.userName} 与 {item.assistantName}</Text>
                    </Space>
                    <Space>
                      <CalendarOutlined />
                      <Text type="secondary">{item.startTime}</Text>
                    </Space>
                    <Space>
                      <MessageOutlined />
                      <Text type="secondary">对话时长：{item.duration}</Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={mockChatData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={total => `共 ${total} 条记录`}
          />
        </div>
      </Card>

      <Drawer
        title="对话详情"
        placement="right"
        width={600}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {currentChat && (
          <div>
            <div className="chat-info">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">对话主题：</Text>
                  <Text strong>{currentChat.topic || '未命名对话'}</Text>
                </div>
                <div>
                  <Text type="secondary">参与者：</Text>
                  <Space>
                    <Avatar src={currentChat.userAvatar} icon={<UserOutlined />} />
                    <Text>{currentChat.userName}</Text>
                    <Text type="secondary">与</Text>
                    <Avatar src={currentChat.assistantAvatar} icon={<RobotOutlined />} />
                    <Text>{currentChat.assistantName}</Text>
                  </Space>
                </div>
                <div>
                  <Text type="secondary">对话时间：</Text>
                  <Text>{currentChat.startTime} 至 {currentChat.endTime}</Text>
                </div>
                <div>
                  <Text type="secondary">对话时长：</Text>
                  <Text>{currentChat.duration}</Text>
                </div>
              </Space>
            </div>
            <Divider />
            <div className="chat-messages">
              <List
                dataSource={currentChat.messages}
                renderItem={message => (
                  <List.Item className={`message-item ${message.sender}`}>
                    <Space align="start">
                      <Avatar
                        src={message.sender === 'user' ? currentChat.userAvatar : currentChat.assistantAvatar}
                        icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      />
                      <div className="message-content">
                        <Text type="secondary" className="message-time">
                          {message.timestamp}
                        </Text>
                        <div className="message-text">
                          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                            {message.content}
                          </Paragraph>
                        </div>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ChatHistoryPage; 