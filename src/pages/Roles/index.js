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

const { TextArea } = Input;
const { Text } = Typography;

// 模拟数据
const initialData = [
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
const mockChatHistory = [
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

const RolesPage = () => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentChatHistory, setCurrentChatHistory] = useState([]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认删除',
      content: '确定要删除这个角色吗？',
      onOk: () => {
        setData(data.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleVerification = (id) => {
    setCurrentId(id);
    verificationForm.resetFields();
    setVerificationModalVisible(true);
  };

  const handleVerificationOk = async () => {
    try {
      const values = await verificationForm.validateFields();
      if (currentId) {
        setData(data.map(item =>
          item.id === currentId ? { ...item, verificationCode: values.verificationCode } : item
        ));
        message.success('设备验证码添加成功');
        setVerificationModalVisible(false);
      }
    } catch (error) {
      console.error('验证码表单验证失败:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        setData(data.map(item =>
          item.id === editingRecord.id ? { ...values, id: item.id } : item
        ));
        message.success('更新成功');
      } else {
        const newId = Math.max(...data.map(item => item.id)) + 1;
        setData([...data, { ...values, id: newId }]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleViewHistory = (roleId) => {
    const history = mockChatHistory.find(h => h.roleId === roleId);
    setCurrentChatHistory(history?.messages || []);
    setDrawerVisible(true);
  };

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
      title: '语音名称',
      dataIndex: 'voiceName',
      key: 'voiceName',
    },
    {
      title: '语音偏好',
      dataIndex: 'voicePreference',
      key: 'voicePreference',
    },
    {
      title: '语言模型',
      dataIndex: 'languageModel',
      key: 'languageModel',
    },
    {
      title: 'Token数量',
      dataIndex: 'tokenCount',
      key: 'tokenCount',
      render: (value) => new Intl.NumberFormat().format(value),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            onClick={() => handleVerification(record.id)}
          >
            验证码
          </Button>
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record.id)}
          >
            历史
          </Button>
          <Button
            type="link"
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
        <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
          添加角色
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={editingRecord ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
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
            <Input />
          </Form.Item>

          <Form.Item
            name="template"
            label="角色模板"
            rules={[{ required: true, message: '请选择角色模板' }]}
          >
            <Select>
              <Select.Option value="友好活泼">友好活泼</Select.Option>
              <Select.Option value="专业严谨">专业严谨</Select.Option>
              <Select.Option value="幽默风趣">幽默风趣</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="voiceName"
            label="语音名称"
            rules={[{ required: true, message: '请选择语音名称' }]}
          >
            <Select>
              <Select.Option value="精灵音">精灵音</Select.Option>
              <Select.Option value="成熟音">成熟音</Select.Option>
              <Select.Option value="童声">童声</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="voicePreference"
            label="语音偏好"
            rules={[{ required: true, message: '请选择语音偏好' }]}
          >
            <Select>
              <Select.Option value="温柔">温柔</Select.Option>
              <Select.Option value="稳重">稳重</Select.Option>
              <Select.Option value="活力">活力</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="introduction"
            label="角色介绍"
            rules={[{ required: true, message: '请输入角色介绍' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="tokenCount"
            label="Token数量"
            rules={[{ required: true, message: '请输入Token数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="languageModel"
            label="语言模型"
            rules={[{ required: true, message: '请选择语言模型' }]}
          >
            <Select>
              <Select.Option value="GPT-4">GPT-4</Select.Option>
              <Select.Option value="Claude-3">Claude-3</Select.Option>
              <Select.Option value="Gemini">Gemini</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设备验证码"
        open={verificationModalVisible}
        onOk={handleVerificationOk}
        onCancel={() => setVerificationModalVisible(false)}
      >
        <Form
          form={verificationForm}
          layout="vertical"
        >
          <Form.Item
            name="verificationCode"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input placeholder="请输入6位验证码" maxLength={6} />
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
          dataSource={currentChatHistory}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar icon={item.role === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                }
                title={
                  <Space>
                    <Text strong>{item.role === 'user' ? '用户' : '助手'}</Text>
                    <Text type="secondary">{item.timestamp}</Text>
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