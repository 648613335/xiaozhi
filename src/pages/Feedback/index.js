import React, { useState } from 'react';
import { Table, Card, Space, Tag, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FeedbackPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState([
    {
      id: '1',
      title: '系统响应速度慢',
      content: '在使用过程中发现系统响应较慢，特别是在数据加载时',
      type: '性能问题',
      priority: '高',
      status: '待处理',
      createTime: '2024-03-20 10:00:00',
      submitter: '张三'
    },
  ]);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === '性能问题' ? 'red' : type === '功能建议' ? 'green' : 'blue'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === '高' ? 'red' : priority === '中' ? 'orange' : 'green'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === '待处理' ? 'orange' : status === '处理中' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>查看</Button>
          <Button type="link" onClick={() => handleEdit(record)}>处理</Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: '反馈详情',
      content: (
        <div>
          <p><strong>标题：</strong>{record.title}</p>
          <p><strong>内容：</strong>{record.content}</p>
          <p><strong>类型：</strong>{record.type}</p>
          <p><strong>优先级：</strong>{record.priority}</p>
          <p><strong>状态：</strong>{record.status}</p>
          <p><strong>提交时间：</strong>{record.createTime}</p>
          <p><strong>提交人：</strong>{record.submitter}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      message.success('操作成功');
      setIsModalVisible(false);
    }).catch(info => {
      console.log('验证失败:', info);
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="反馈管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加反馈
          </Button>
        }
      >
        <Table columns={columns} dataSource={feedbackData} rowKey="id" />
      </Card>

      <Modal
        title="反馈处理"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select>
              <Select.Option value="性能问题">性能问题</Select.Option>
              <Select.Option value="功能建议">功能建议</Select.Option>
              <Select.Option value="bug反馈">bug反馈</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select>
              <Select.Option value="高">高</Select.Option>
              <Select.Option value="中">中</Select.Option>
              <Select.Option value="低">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="待处理">待处理</Select.Option>
              <Select.Option value="处理中">处理中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackPage; 