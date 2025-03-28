import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import service from '@/utils/service';
import { C_Table, C_Page } from '@/components';

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // 获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    setUsers([])
    try {
      const response = await service.getlist('users/list', { results: 10 });
      if (response.success && response.data) {
        const formattedUsers = response.data.results.map((user, index) => ({
          key: index,
          id: user.login.uuid,
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
          location: `${user.location.city}, ${user.location.country}`
        }));
        setUsers(formattedUsers);
      } else {
        message.error('获取用户数据失败');
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
      message.error('获取用户数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理添加用户
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (record) => {
    setEditingId(record.key);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除用户
  const handleDelete = async (key) => {
    try {
      const response = await service.delete('users/delete', { id: users[key].id });
      if (response.success) {
        setUsers(users.filter(item => item.key !== key));
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId === null) {
        // 添加新用户
        const response = await service.post('users/create', values);
        if (response.success) {
          const newUser = {
            ...values,
            key: users.length,
            id: response.data.id || `new-${Date.now()}`
          };
          setUsers([...users, newUser]);
          message.success('添加成功');
          setModalVisible(false);
        } else {
          message.error('添加失败');
        }
      } else {
        // 更新现有用户
        const response = await service.post('users/update', {
          id: users[editingId].id,
          ...values
        });
        if (response.success) {
          setUsers(users.map(user =>
            user.key === editingId ? { ...user, ...values } : user
          ));
          message.success('更新成功');
          setModalVisible(false);
        } else {
          message.error('更新失败');
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <C_Page title="用户管理"
      rightArea={<Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
        >
          刷新数据
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined loading={!loading} />}
          onClick={handleAdd}
        >
          添加用户
        </Button>
      </Space>}
    >
      <C_Table
        table={{
          columns, // 表格列配置
          dataSource: users, // 数据源
          loading, // 是否加载中
        }}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingId === null ? '添加用户' : '编辑用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingId === null ? '添加' : '保存'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </C_Page>
  );
};

export default UsersPage; 