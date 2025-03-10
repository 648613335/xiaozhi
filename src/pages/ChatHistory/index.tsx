import React, { useState } from 'react';
import {
  Card,
  List,
  Tag,
  Typography,
  Input,
  DatePicker,
  Select,
  Space,
  Button,
  Avatar,
  Drawer,
  Divider,
  Empty,
  Pagination
} from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import '@/assets/global.css';
import './chatHistory.css';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟聊天记录数据
interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

interface ChatRecord {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  assistantId: number;
  assistantName: string;
  assistantAvatar?: string;
  messages: Message[];
  startTime: string;
  endTime: string;
  duration: string;
  topic?: string;
  messageCount: number;
}

const mockChatData: ChatRecord[] = [
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

const ChatHistoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatRecord | null>(null);

  // 处理查看对话详情
  const handleViewDetail = (record: ChatRecord) => {
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
          <Space wrap>
            <Input
              placeholder="搜索关键词"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
            <Select
              placeholder="选择角色"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              style={{ width: 180 }}
              allowClear
            >
              <Option value="assistant1">智能助手小明</Option>
              <Option value="advisor1">专业顾问小华</Option>
              <Option value="customerService">客服机器人</Option>
              <Option value="programmingCoach">编程教练</Option>
            </Select>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch}>
              筛选
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>
      </div>

      <Card className="chat-history-list">
        <List
          itemLayout="vertical"
          dataSource={mockChatData}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Space key="info-1">
                  <CalendarOutlined />
                  <span>{item.startTime}</span>
                </Space>,
                <Space key="info-2">
                  <MessageOutlined />
                  <span>{item.messageCount}条消息</span>
                </Space>,
                <Space key="info-3">
                  <TeamOutlined />
                  <span>{item.userName} & {item.assistantName}</span>
                </Space>,
                <Button 
                  type="link" 
                  key="view-detail" 
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(item)}
                >
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="chat-avatars">
                    <Avatar src={item.userAvatar} icon={<UserOutlined />} />
                    <Avatar src={item.assistantAvatar} icon={<RobotOutlined />} />
                  </div>
                }
                title={
                  <div className="chat-title">
                    <span className="chat-title-text">对话 #{item.id}</span>
                    {item.topic && <Tag color="blue">{item.topic}</Tag>}
                    <Text type="secondary" className="chat-duration">
                      {item.duration}
                    </Text>
                  </div>
                }
                description={
                  <div className="chat-description">
                    <Text className="chat-preview" ellipsis>
                      {item.messages[0]?.content || '无对话内容'}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div className="pagination-container">
          <Pagination 
            current={currentPage}
            total={50}
            pageSize={pageSize}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </div>
      </Card>

      <Drawer
        title={
          <div className="chat-detail-title">
            {currentChat && (
              <>
                <div>
                  <Space>
                    <span>对话 #{currentChat.id}</span>
                    {currentChat.topic && <Tag color="blue">{currentChat.topic}</Tag>}
                  </Space>
                </div>
                <div className="chat-detail-info">
                  <Space>
                    <CalendarOutlined />
                    <span>{currentChat.startTime} ~ {currentChat.endTime}</span>
                    <Divider type="vertical" />
                    <MessageOutlined />
                    <span>{currentChat.messageCount}条消息</span>
                  </Space>
                </div>
              </>
            )}
          </div>
        }
        width={640}
        placement="right"
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {currentChat ? (
          <div className="chat-messages">
            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                    <Avatar src={currentChat.userAvatar} icon={<UserOutlined />} />
                  ) : (
                    <Avatar src={currentChat.assistantAvatar} icon={<RobotOutlined />} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-name">
                      {message.sender === 'user' ? currentChat.userName : currentChat.assistantName}
                    </span>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                  <div className="message-text">
                    <Paragraph>{message.content}</Paragraph>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="未选择对话" />
        )}
      </Drawer>
    </div>
  );
};

export default ChatHistoryPage; 