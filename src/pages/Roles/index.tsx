import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Typography,
  Drawer,
  List,
  Avatar,
  Tag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  QrcodeOutlined,
  HistoryOutlined,
  UserOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import '@/assets/global.css';

interface RoleData {
  id: number;
  nickname: string;
  template: string;
  voiceName: string;
  voicePreference: string;
  introduction: string;
  tokenCount: number;
  languageModel: string;
  verificationCode?: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  roleId: number;
  messages: ChatMessage[];
}

const { TextArea } = Input;
const { Text } = Typography;

// 模拟数据
const initialData: RoleData[] = [
  {
    id: 1,
    nickname: '智能助手小明',
    template: '友好活泼',
    voiceName: '精灵音',
    voicePreference: '温柔',
    introduction: '我是一个充满活力的AI助手，喜欢帮助他人解决问题。',
    tokenCount: 100000000,
    languageModel: 'GPT-4',
    verificationCode: 'ABC123',
  },
  {
    id: 2,
    nickname: '专业顾问小华',
    template: '专业严谨',
    voiceName: '成熟音',
    voicePreference: '稳重',
    introduction: '专注于提供专业的商业咨询和技术指导。',
    tokenCount: 200000000,
    languageModel: 'Claude-3',
    verificationCode: 'XYZ789',
  },
];

// 模拟历史对话数据
const mockChatHistory: ChatHistory[] = [
  {
    roleId: 1,
    messages: [
      {
        id: 1,
        role: 'user',
        content: '你好，请介绍一下你自己',
        timestamp: '2024-03-20 14:30:00',
      },
      {
        id: 2,
        role: 'assistant',
        content: '你好！我是智能助手小明，我的性格友好活泼，很高兴能帮助你解决问题。',
        timestamp: '2024-03-20 14:30:05',
      },
      {
        id: 3,
        role: 'user',
        content: '你能做些什么？',
        timestamp: '2024-03-20 14:31:00',
      },
      {
        id: 4,
        role: 'assistant',
        content: '我可以帮你回答问题、编写代码、分析数据，以及进行日常对话交流等。需要我为你做什么吗？',
        timestamp: '2024-03-20 14:31:05',
      },
    ],
  },
  {
    roleId: 2,
    messages: [
      {
        id: 1,
        role: 'user',
        content: '请问如何优化项目性能？',
        timestamp: '2024-03-20 15:00:00',
      },
      {
        id: 2,
        role: 'assistant',
        content: '项目性能优化可以从以下几个方面考虑：1. 代码层面的优化，如减少不必要的渲染...',
        timestamp: '2024-03-20 15:00:10',
      },
    ],
  },
];

// 定义一个名为 RolesPage 的 React 组件，使用函数组件和 React.FC 类型
const RolesPage: React.FC = () => {
  // 使用 useState 钩子管理角色数据，初始值为 initialData
  const [data, setData] = useState<RoleData[]>(initialData);
  // 使用 useState 钩子管理模态框的可见性，初始值为 false
  const [modalVisible, setModalVisible] = useState(false);
  // 使用 useState 钩子管理当前正在编辑的角色记录，初始值为 null
  const [editingRecord, setEditingRecord] = useState<RoleData | null>(null);
  // 使用 useState 钩子管理验证码模态框的可见性，初始值为 false
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  // 使用 useState 钩子管理当前操作的记录 ID，初始值为 null
  const [currentId, setCurrentId] = useState<number | null>(null);
  // 使用 Form.useForm 钩子创建一个表单实例
  const [form] = Form.useForm();
  // 使用 Form.useForm 钩子创建一个验证码表单实例
  const [verificationForm] = Form.useForm();
  // 使用 useState 钩子管理抽屉的可见性，初始值为 false
  const [drawerVisible, setDrawerVisible] = useState(false);
  // 使用 useState 钩子管理当前查看的聊天历史记录，初始值为空数组
  const [currentChatHistory, setCurrentChatHistory] = useState<ChatMessage[]>([]);

  // 处理添加角色按钮点击事件
  const handleAdd = () => {
    setEditingRecord(null); // 清空当前编辑记录
    form.resetFields(); // 重置表单字段
    setModalVisible(true); // 显示模态框
  };

  // 处理编辑角色按钮点击事件
  const handleEdit = (record: RoleData) => {
    setEditingRecord(record); // 设置当前编辑记录
    form.setFieldsValue(record); // 设置表单字段值为当前记录的数据
    setModalVisible(true); // 显示模态框
  };

  // 处理删除角色按钮点击事件
  const handleDelete = (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认删除', // 模态框标题
      content: '确定要删除这个角色吗？', // 模态框内容
      onOk: () => {
        setData(data.filter(item => item.id !== id)); // 过滤掉当前 ID 的记录
        message.success('删除成功'); // 显示删除成功的消息
      },
    });
  };

  // 处理添加或更新设备验证码按钮点击事件
  const handleVerification = (id: number) => {
    setCurrentId(id); // 设置当前操作的记录 ID
    verificationForm.resetFields(); // 重置验证码表单字段
    setVerificationModalVisible(true); // 显示验证码模态框
  };

  // 处理验证码模态框确认按钮点击事件
  const handleVerificationOk = async () => {
    try {
      const values = await verificationForm.validateFields(); // 获取验证码表单的值
      if (currentId) {
        setData(data.map(item =>
          item.id === currentId ? { ...item, verificationCode: values.verificationCode } : item
        )); // 更新当前记录的验证码
        message.success('设备验证码添加成功'); // 显示添加成功的消息
        setVerificationModalVisible(false); // 关闭验证码模态框
      }
    } catch (error) {
      console.error('验证码表单验证失败:', error); // 打印错误信息
    }
  };

  // 处理模态框确认按钮点击事件
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields(); // 获取表单的值
      if (editingRecord) {
        // 编辑现有记录
        setData(data.map(item =>
          item.id === editingRecord.id ? { ...values, id: item.id } : item
        )); // 更新当前记录的数据
        message.success('更新成功'); // 显示更新成功的消息
      } else {
        // 添加新记录
        const newId = Math.max(...data.map(item => item.id)) + 1; // 生成新的 ID
        setData([...data, { ...values, id: newId }]); // 添加新记录到数据中
        message.success('添加成功'); // 显示添加成功的消息
      }
      setModalVisible(false); // 关闭模态框
    } catch (error) {
      console.error('表单验证失败:', error); // 打印错误信息
    }
  };

  // 处理查看历史对话按钮点击事件
  const handleViewHistory = (roleId: number) => {
    const history = mockChatHistory.find(h => h.roleId === roleId); // 查找对应角色的聊天历史
    setCurrentChatHistory(history?.messages || []); // 设置当前查看的聊天历史记录
    setDrawerVisible(true); // 显示抽屉
  };

  // 定义表格列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '助手昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '角色模板',
      dataIndex: 'template',
      key: 'template',
    },
    {
      title: '角色音色',
      dataIndex: 'voiceName',
      key: 'voiceName',
    },
    {
      title: '语音偏好',
      dataIndex: 'voicePreference',
      key: 'voicePreference',
    },
    {
      title: '当前Token量',
      dataIndex: 'tokenCount',
      key: 'tokenCount',
      render: (text: number) => `${(text / 100000000).toFixed(2)}亿`, // 格式化 Token 量显示
    },
    {
      title: '语言模型',
      dataIndex: 'languageModel',
      key: 'languageModel',
    },
    {
      title: '设备验证码',
      dataIndex: 'verificationCode',
      key: 'verificationCode',
      render: (text: string, record: RoleData) => (
        <Space>
          {text ? (
            <Text copyable>{text}</Text> // 如果有验证码，显示可复制的文本
          ) : (
            <Text type="secondary">未设置</Text> // 如果没有验证码，显示未设置
          )}
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            onClick={() => handleVerification(record.id)}
          >
            {text ? '更新验证码' : '添加验证码'}
          </Button>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RoleData) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record.id)}
          >
            历史对话
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="content-container">
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加角色
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingRecord ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={720}
        okText={'确认'}
        cancelText={'取消'}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="nickname"
            label="助手昵称"
            rules={[{ required: true, message: '请输入助手昵称' }]}
          >
            <Input placeholder="请输入助手昵称" />
          </Form.Item>
          <Form.Item
            name="template"
            label="角色模板"
            rules={[{ required: true, message: '请输入角色模板' }]}
          >
            <Select placeholder="请选择角色模板">
              <Select.Option value="友好活泼">友好活泼</Select.Option>
              <Select.Option value="专业严谨">专业严谨</Select.Option>
              <Select.Option value="幽默风趣">幽默风趣</Select.Option>
              <Select.Option value="温和耐心">温和耐心</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="voiceName"
            label="角色音色"
            rules={[{ required: true, message: '请输入角色音色' }]}
          >
            <Input placeholder="请输入角色音色" />
          </Form.Item>
          <Form.Item
            name="voicePreference"
            label="语音偏好"
            rules={[{ required: true, message: '请输入语音偏好' }]}
          >
            <Select placeholder="请选择语音偏好">
              <Select.Option value="温柔">温柔</Select.Option>
              <Select.Option value="稳重">稳重</Select.Option>
              <Select.Option value="活力">活力</Select.Option>
              <Select.Option value="庄重">庄重</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="introduction"
            label="角色介绍"
            rules={[{ required: true, message: '请输入角色介绍' }]}
          >
            <TextArea rows={4} placeholder="请输入角色介绍" />
          </Form.Item>
          <Form.Item
            name="tokenCount"
            label="Token量（单位：亿）"
            rules={[{ required: true, message: '请输入Token量' }]}
          >
            <InputNumber
              min={1}
              max={1000}
              placeholder="请输入Token量"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="languageModel"
            label="语言模型"
            rules={[{ required: true, message: '请选择语言模型' }]}
          >
            <Select placeholder="请选择语言模型">
              <Select.Option value="GPT-4">GPT-4</Select.Option>
              <Select.Option value="GPT-3.5">GPT-3.5</Select.Option>
              <Select.Option value="Claude-3">Claude-3</Select.Option>
              <Select.Option value="Claude-2">Claude-2</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="设备验证"
        open={verificationModalVisible}
        onOk={handleVerificationOk}
        onCancel={() => setVerificationModalVisible(false)}
        okText={'确认'}
        cancelText={'取消'}
      >
        <Form
          form={verificationForm}
          layout="vertical"
        >
          <Form.Item
            name="verificationCode"
            label="设备验证码"
            rules={[
              { required: true, message: '请输入设备验证码' },
              { pattern: /^[A-Za-z0-9]{6,12}$/, message: '验证码必须是6-12位字母数字组合' }
            ]}
            extra="验证码用于设备认证，请妥善保管"
          >
            <Input placeholder="请输入6-12位字母数字组合的验证码" />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="历史对话记录"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <List
          itemLayout="horizontal"
          dataSource={currentChatHistory}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar icon={item.role === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                }
                title={
                  <Space>
                    <Tag color={item.role === 'user' ? 'blue' : 'green'}>
                      {item.role === 'user' ? '用户' : '助手'}
                    </Tag>
                    <span>{item.timestamp}</span>
                  </Space>
                }
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};

export default RolesPage; 