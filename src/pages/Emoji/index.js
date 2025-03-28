import React, { useState, useEffect } from 'react';
import { Typography, Button, Space, Modal, Form, Input, message, Popconfirm, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import service from '@/utils/service';
import Table from '@/components/c_Table';

const { Title } = Typography;
const { TextArea } = Input;

const EmojiPage = () => {
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // 获取表情包数据
  const fetchEmojis = async () => {
    setLoading(true);
    setEmojis([]);
    try {
      const response = await service.getlist('emoji/list');
      if (response.success && response.data) {
        // 模拟数据，实际项目中应该使用后端返回的数据
        const mockData = Array(10).fill().map((_, index) => ({
          key: index,
          id: `emoji-${index}`,
          name: `表情${index + 1}`,
          category: ['搞笑', '可爱', '商务'][Math.floor(Math.random() * 3)],
          imageUrl: `https://picsum.photos/100/100?random=${index}`,
          description: `这是表情${index + 1}的描述信息`,
          createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
        }));
        setEmojis(mockData);
      } else {
        message.error('获取表情包数据失败');
      }
    } catch (error) {
      console.error('获取表情包数据失败:', error);
      message.error('获取表情包数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmojis();
  }, []);

  // 处理图片上传
  const handleUpload = async (file) => {
    try {
      // 这里应该调用实际的上传API
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
      message.success('上传成功');
      return false; // 阻止自动上传
    } catch (error) {
      message.error('上传失败');
      return false;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '预览',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url) => (
        <Image
          src={url}
          alt="表情包预览"
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
            title="确定要删除这个表情包吗？"
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

  // 处理添加表情包
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setImageUrl('');
    setModalVisible(true);
  };

  // 处理编辑表情包
  const handleEdit = (record) => {
    setEditingId(record.key);
    setImageUrl(record.imageUrl);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除表情包
  const handleDelete = async (key) => {
    try {
      const response = await service.delete('emoji/delete', { id: emojis[key].id });
      if (response.success) {
        setEmojis(emojis.filter(item => item.key !== key));
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除表情包失败:', error);
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId === null) {
        // 添加新表情包
        const response = await service.post('emoji/create', {
          ...values,
          imageUrl
        });
        if (response.success) {
          const newEmoji = {
            ...values,
            imageUrl,
            key: emojis.length,
            id: response.data.id || `new-${Date.now()}`,
            createTime: new Date().toLocaleString()
          };
          setEmojis([...emojis, newEmoji]);
          message.success('添加成功');
          setModalVisible(false);
        } else {
          message.error('添加失败');
        }
      } else {
        // 更新表情包
        const response = await service.post('emoji/update', {
          id: emojis[editingId].id,
          ...values,
          imageUrl
        });
        if (response.success) {
          setEmojis(emojis.map(item =>
            item.key === editingId ? {
              ...item,
              ...values,
              imageUrl
            } : item
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
        <Title level={2}>表情包管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchEmojis}
          >
            刷新数据
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加表情包
          </Button>
        </Space>
      </div>

      <Table
        table={{
          columns,
          dataSource: emojis,
          loading,
        }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId === null ? '添加表情包' : '编辑表情包'}
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
          <Form.Item label="表情包图片" required>
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="表情包"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入表情包名称' }]}
          >
            <Input placeholder="请输入表情包名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入分类' }]}
          >
            <Input placeholder="请输入分类" />
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

export default EmojiPage; 