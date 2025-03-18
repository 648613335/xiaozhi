import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Input, Form, Select, Card, message, Modal, Drawer, List, Avatar, Tag, TextArea } from 'antd';
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, QrcodeOutlined, HistoryOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { C_Table, C_Form } from '@/components';
import service from '@/utils/service';
import comData from '@/utils/comData';

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟历史对话数据
const mockChatHistory = [
  {
    roleId: '1',
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
    ],
  },
  {
    roleId: '2',
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
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchForm] = Form.useForm();
  const [editform] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [currentChatHistory, setCurrentChatHistory] = useState([]);

  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '语音名称',
      dataIndex: 'timbre',
      key: 'timbre',
    },
    {
      title: '语言模型',
      dataIndex: 'languageModel',
      key: 'languageModel',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditShow(record)}
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
            onClick={() => handleDeleteShow(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 查询列表数据
  const fetch = async (params = {}) => {
    setLoading(true);
    setDataSource([])
    try {
      const response = await service.getlist('roles/list', { page: 1, ...params });
      if (response.success && response.data) {
        const data = response.data.map((item, index) => ({
          key: index,
          ...item,
        }));
        setDataSource(data);
      } else {
        message.error('获取用户数据失败');
      }
    } catch (error) {
      message.error('获取用户数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  // 处理搜索
  const handleSearch = async () => {
    const values = await searchForm.validateFields();
    fetch(values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetch();
  };

  // 处理添加角色
  const handleAddShow = () => {
    setEditing(1)
    editform.resetFields();
    setModalVisible(true);
  };

  // 新增
  const handleAdd = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('roles/rolesadd', { ...params });
      if (response.success) {
        message.error('编辑成功');
        setModalVisible(false);
      } else {
        message.error('编辑失败');
      }
    } catch (error) {
      message.error('编辑失败');
    }
    setLoading(false);
  };

  // 处理编辑角色
  const handleEditShow = (record) => {
    setEditing(0)
    handleDetail(record.id)
  };

  // 编辑
  const handleEdit = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('roles/rolesedit', { ...params });
      if (response.success) {
        message.error('编辑成功');
        setModalVisible(false);
      } else {
        message.error('编辑失败');
      }
    } catch (error) {
      message.error('编辑失败');
    }
    setLoading(false);
  };

  // 根据id查询详情
  const handleDetail = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('roles/rolesquery', { ...params });
      if (response.success && response.data) {
        setModalVisible(true);
        editform.setFieldsValue(response.data);
      } else {
        message.error('获取用户数据失败');
      }
    } catch (error) {
      message.error('获取用户数据失败');
    }
    setLoading(false);
  };

  // 根据id查询详情
  const handleDelete = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('roles/rolesdelete', { ...params });
      if (response.success) {
        fetch();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
    setLoading(false);
  };

  // 处理删除角色
  const handleDeleteShow = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        handleDelete(id);
      },
    });
  };

  // 处理验证码
  const handleVerification = (id) => {
    setCurrentId(id);
    verificationForm.resetFields();
    setVerificationModalVisible(true);
  };

  // 处理验证码确认
  const handleVerificationOk = async () => {
    try {
      const values = await verificationForm.validateFields();
      message.success('验证码设置成功');
      setVerificationModalVisible(false);
    } catch (error) {
      console.error('验证码表单验证失败:', error);
    }
  };

  // 处理表单提交
  const handleModalOk = async () => {
    try {
      const values = await editform.validateFields();
      if (editing) {
        await handleAdd(values);
      } else {
        await handleEdit(values);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理查看历史
  const handleViewHistory = (roleId) => {
    const history = mockChatHistory.find(h => h.roleId === roleId);
    setCurrentChatHistory(history?.messages || []);
    setDrawerVisible(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>角色管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddShow}>
          添加角色
        </Button>
      </div>

      <Card>
        <C_Form
          form={{
            form: searchForm,
            layout: "inline",
            handleSearch,
            handleReset
          }}
          formItems={[
            {
              label: "角色名称",
              name: "name",
              type: 'input',
              input: {
                placeholder: "请输入角色名称"
              }
            },
            {
              label: "语音名称",
              name: "timbre",
              type: 'input',
              input: {
                placeholder: "请输入语音名称"
              }
            },
            {
              label: "语言模型",
              name: "languageModel",
              type: 'select',
              select: {
                defaultValue: 'ASR',
                placeholder: "请输入语音名称",
                options: comData.languageModel
              }
            }
          ]}
        />
      </Card>

      <C_Table
        table={{ columns, dataSource, loading, rowKey: 'id' }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editing ? '添加角色' : '编辑角色'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={editform}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="timbre"
            label="语音名称"
            rules={[{ required: true, message: '请选择语音名称' }]}
          >
            <Select placeholder="请选择语音名称">
              <Option value="小美">小美</Option>
              <Option value="小强">小强</Option>
              <Option value="小智">小智</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="language"
            label="语言偏好"
            rules={[{ required: true, message: '请选择语言偏好' }]}
          >
            <Select placeholder="请选择语言偏好">
              <Option value="温柔">温柔</Option>
              <Option value="稳重">稳重</Option>
              <Option value="活力">活力</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="introduce"
            label="角色介绍"
            rules={[{ required: true, message: '请输入角色介绍' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入角色介绍" />
          </Form.Item>
          <Form.Item
            name="memory"
            label="记忆体"
            rules={[{ required: true, message: '请输入记忆体' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入记忆体" />
          </Form.Item>
          <Form.Item
            name="languageModel"
            label="语言模型"
            rules={[{ required: true, message: '请选择语言模型' }]}
          >
            <Select placeholder="请选择语言模型">
              <Option value="GPT-3.5">GPT-3.5</Option>
              <Option value="GPT-4">GPT-4</Option>
              <Option value="Claude">Claude</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设备验证码"
        open={verificationModalVisible}
        onOk={handleVerificationOk}
        onCancel={() => setVerificationModalVisible(false)}
        okText="确认"
        cancelText="取消"
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