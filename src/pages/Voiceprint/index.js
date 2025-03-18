import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import service from '@/utils/service';
import '@/assets/global.css';
import Table from '@/components/c_Table';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const VoiceprintPage = () => {
  const [voiceprints, setVoiceprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // 获取声纹数据
  const fetchVoiceprints = async () => {
    setLoading(true);
    setVoiceprints([]);
    try {
      const response = await service.getlist('voiceprint/list');
      if (response.success && response.data) {
        // 模拟数据，实际项目中应该使用后端返回的数据
        const mockData = Array(10).fill().map((_, index) => ({
          key: index,
          id: `vp-${index}`,
          name: `声纹样本${index + 1}`,
          role: ['管理员', '用户', '访客'][Math.floor(Math.random() * 3)],
          vector: Array(5).fill().map(() => Math.random().toFixed(4)).join(', '),
          description: `这是声纹样本${index + 1}的描述信息`
        }));
        setVoiceprints(mockData);
      } else {
        message.error('获取声纹数据失败');
      }
    } catch (error) {
      console.error('获取声纹数据失败:', error);
      message.error('获取声纹数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVoiceprints();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '声纹向量',
      dataIndex: 'vector',
      key: 'vector',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
            title="确定要删除这条声纹记录吗？"
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

  // 处理添加声纹
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑声纹
  const handleEdit = (record) => {
    setEditingId(record.key);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除声纹
  const handleDelete = async (key) => {
    try {
      const response = await service.delete('voiceprint/delete', { id: voiceprints[key].id });
      if (response.success) {
        setVoiceprints(voiceprints.filter(item => item.key !== key));
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除声纹失败:', error);
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId === null) {
        // 添加新声纹
        const response = await service.post('voiceprint/create', values);
        if (response.success) {
          const newVoiceprint = {
            ...values,
            key: voiceprints.length,
            id: response.data.id || `new-${Date.now()}`
          };
          setVoiceprints([...voiceprints, newVoiceprint]);
          message.success('添加成功');
          setModalVisible(false);
        } else {
          message.error('添加失败');
        }
      } else {
        // 更新声纹
        const response = await service.post('voiceprint/update', {
          id: voiceprints[editingId].id,
          ...values
        });
        if (response.success) {
          setVoiceprints(voiceprints.map(item =>
            item.key === editingId ? { ...item, ...values } : item
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>声纹识别</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchVoiceprints}
          >
            刷新数据
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加声纹
          </Button>
        </Space>
      </div>

      <Table
        table={{
          columns,
          dataSource: voiceprints,
          loading,
        }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId === null ? '添加声纹' : '编辑声纹'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingId === null ? '添加' : '保存'}
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入声纹名称' }]}
          >
            <Input placeholder="请输入声纹名称" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="管理员">管理员</Option>
              <Option value="用户">用户</Option>
              <Option value="访客">访客</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="vector"
            label="声纹向量"
            rules={[{ required: true, message: '请输入声纹向量' }]}
          >
            <Input placeholder="请输入声纹向量，多个数值用逗号分隔" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述信息' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入描述信息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoiceprintPage; 