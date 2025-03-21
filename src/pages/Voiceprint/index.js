import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import service from '@/utils/service';
import { C_Table, C_Form } from '@/components';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const VoiceprintPage = () => {
  const [voiceprints, setVoiceprints] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [searchForm] = Form.useForm(); // 搜索表单实例
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editform] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState(null);

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

  // 查询列表数据
  const fetch = async (params = {}) => {
    setLoading(true);
    setDataSource([])
    try {
      const response = await service.getlist('voiceprint/list', { page: 1, ...params });
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

  
  // 处理添加声纹
  const handleAddShow = () => {
    setEditing(1)
    editform.resetFields();
    setModalVisible(true);
  };

  // 处理编辑声纹
  const handleEdit = (record) => {
    setEditingId(record.key);
    editform.setFieldsValue(record);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>声纹识别</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddShow}
        >
          添加声纹
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
              label: "名称",
              name: "name",
              type: 'input',
              input: {
                placeholder: "请输入名称"
              }
            },
            {
              label: "角色名称",
              name: "rolesid",
              type: 'select',
              select: {
                defaultValue: 'ASR',
                placeholder: "请选择角色名称",
                options:[]
              }
            },
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
        title={editingId === null ? '添加声纹' : '编辑声纹'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editingId === null ? '添加' : '保存'}
        cancelText="取消"
        width={600}
      >
        <Form
          form={editform}
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