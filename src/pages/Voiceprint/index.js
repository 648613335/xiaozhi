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
      dataIndex: 'rolesname',
      key: 'rolesname',
    },
    {
      title: '声纹向量',
      dataIndex: 'voiceprintVector',
      key: 'voiceprintVector',
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
            onClick={() => handleEditShow(record)}
          >
            编辑
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteShow(record.key)}>
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

  // 新增
  const handleAdd = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('voiceprint/add', { ...params });
      if (response.success) {
        message.success('编辑成功');
        setModalVisible(false);
      } else {
        message.error('编辑失败');
      }
    } catch (error) {
      message.error('编辑失败');
    }
    setLoading(false);
  };

  // 处理编辑声纹
  const handleEditShow = (record) => {
    setEditing(0);
    handleDetail(record.id)
  };

  // 编辑
  const handleEdit = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('voiceprint/edit', { ...params });
      if (response.success) {
        message.success('编辑成功');
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
      const response = await service.getinfo('voiceprint/query', { ...params });
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

  // 根据id删除
  const handleDelete = async (params = {}) => {
    setLoading(true);
    try {
      const response = await service.getinfo('voiceprint/delete', { ...params });
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
  // 处理删除声纹
  const handleDeleteShow = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此条数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        handleDelete(id);
      },
    });
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
                options: []
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
        title={editing ? '添加声纹' : '编辑声纹'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="确认"
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
            name="rolesid"
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
            name="voiceprintVector"
            label="声纹向量"
            rules={[{ required: true, message: '请输入声纹向量' }]}
          >
            <Input placeholder="请输入声纹向量" />
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