import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  Typography,
  Popconfirm,
  message,
  Tooltip,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  TagsOutlined
} from '@ant-design/icons';
import '@/assets/global.css';
import './knowledgeBase.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;


// 模拟知识库数据
const mockKnowledgeData = [
  {
    id: 1,
    question: '什么是人工智能？',
    answer: '人工智能（AI）是计算机科学的一个分支，旨在开发能够执行通常需要人类智能的任务的系统。这包括视觉感知、语音识别、决策制定和语言翻译等。人工智能技术包括机器学习、深度学习、自然语言处理等。',
    category: '技术',
    tags: ['AI', '机器学习', '基础概念'],
    createdAt: '2024-06-01 10:30:45',
    updatedAt: '2024-06-01 10:30:45',
    status: 'active'
  },
  {
    id: 2,
    question: '如何重置我的账户密码？',
    answer: '重置密码的步骤：\n1. 点击登录页面的"忘记密码"\n2. 输入您的注册邮箱或手机号\n3. 您将收到一个重置链接或验证码\n4. 点击链接或输入验证码后，设置新密码\n5. 使用新密码登录系统',
    category: '账户管理',
    tags: ['密码', '账户', '安全'],
    createdAt: '2024-06-02 14:25:32',
    updatedAt: '2024-06-05 09:12:40',
    status: 'active'
  },
  {
    id: 3,
    question: '如何提高网站的SEO排名？',
    answer: '提高网站SEO排名的关键策略：\n\n1. 确保高质量的内容\n2. 优化页面标题和描述\n3. 提高网站加载速度\n4. 使用适当的关键词密度\n5. 构建高质量的反向链接\n6. 确保移动友好的设计\n7. 更新网站内容\n8. 使用结构化数据标记\n9. 提高用户体验\n10. 通过社交媒体推广',
    category: '营销',
    tags: ['SEO', '网站优化', '数字营销'],
    createdAt: '2024-06-03 15:45:20',
    updatedAt: '2024-06-03 15:45:20',
    status: 'active'
  },
  {
    id: 4,
    question: '什么是响应式设计？',
    answer: '响应式设计是一种网页设计方法，使网站能够自动调整和适应不同的屏幕尺寸和设备。这种方法使用灵活的网格布局、灵活的图像和CSS媒体查询，确保网站在台式机、平板电脑和智能手机等各种设备上都能提供最佳的浏览体验。',
    category: '设计',
    tags: ['网页设计', 'CSS', '用户体验'],
    createdAt: '2024-06-04 11:20:15',
    updatedAt: '2024-06-10 16:30:22',
    status: 'active'
  },
  {
    id: 5,
    question: '公司的退款政策是什么？',
    answer: '我们的退款政策如下：\n\n- 购买后30天内发现产品质量问题，可申请全额退款\n- 服务类产品使用不超过25%可申请部分退款\n- 定制类产品不支持退款\n- 退款申请需提供购买凭证和问题描述\n- 退款将在审核通过后7个工作日内退回原支付方式',
    category: '客户服务',
    tags: ['退款', '政策', '售后'],
    createdAt: '2024-06-05 09:10:40',
    updatedAt: '2024-06-05 09:10:40',
    status: 'active'
  },
  {
    id: 6,
    question: '推荐一些学习编程的资源',
    answer: '学习编程的优质资源：\n\n1. 在线课程平台：Coursera, Udemy, edX\n2. 交互式学习：LeetCode, HackerRank, CodeAcademy\n3. 文档资源：MDN Web Docs, W3Schools\n4. YouTube频道：CS50, Traversy Media, The Net Ninja\n5. 社区：Stack Overflow, GitHub, Dev.to\n6. 书籍：《Clean Code》, 《You Don”t Know JS》\n7. 博客：CSS-Tricks, Smashing Magazine',
    category: '教育',
    tags: ['编程', '学习资源', '自学'],
    createdAt: '2024-06-06 13:50:30',
    updatedAt: '2024-06-06 13:50:30',
    status: 'draft'
  }
];

// 定义分类和状态选项
const categoryOptions = ['技术', '账户管理', '营销', '设计', '客户服务', '教育', '其他'];
const statusOptions = [
  { value: 'active', label: '已发布', color: 'green' },
  { value: 'draft', label: '草稿', color: 'gold' },
  { value: 'archived', label: '已归档', color: 'gray' }
];

const KnowledgeBasePage = () => {
  const [dataSource, setDataSource] = useState(mockKnowledgeData);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // 处理添加新知识条目
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑知识条目
  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags.join(',')
    });
    setModalVisible(true);
  };

  // 处理删除知识条目
  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id));
    message.success('知识条目已删除');
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const tags = values.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

      const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

      if (editingItem) {
        // 更新现有条目
        setDataSource(dataSource.map(item =>
          item.id === editingItem.id
            ? {
              ...item,
              ...values,
              tags,
              updatedAt: currentDate
            }
            : item
        ));
        message.success('知识条目已更新');
      } else {
        // 添加新条目
        const newItem = {
          id: Math.max(...dataSource.map(item => item.id)) + 1,
          ...values,
          tags,
          createdAt: currentDate,
          updatedAt: currentDate
        };
        setDataSource([...dataSource, newItem]);
        message.success('知识条目已添加');
      }

      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    // 对数据源应用筛选条件
    let filteredData = mockKnowledgeData;

    if (searchText) {
      filteredData = filteredData.filter(
        item =>
          item.question.toLowerCase().includes(searchText.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter(item => item.category === selectedCategory);
    }

    if (selectedStatus) {
      filteredData = filteredData.filter(item => item.status === selectedStatus);
    }

    setDataSource(filteredData);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedStatus('');
    setDataSource(mockKnowledgeData);
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
    },
    {
      title: '答案',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <div className="answer-preview">{text}</div>
        </Tooltip>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 220,
      render: (tags) => (
        <div className="tag-container">
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = statusOptions.find(opt => opt.value === status);
        return statusInfo ? <Tag color={statusInfo.color}>{statusInfo.label}</Tag> : status;
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定要删除这个知识条目吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="content-container knowledge-base-page">
      <div className="kb-header">
        <Title level={2}>
          <BookOutlined /> 知识库管理
        </Title>
        <div className="filter-container">
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Input
                placeholder="搜索问题、答案或标签"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={12} sm={5}>
              <Select
                placeholder="选择分类"
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                style={{ width: '100%' }}
                allowClear
              >
                {categoryOptions.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={5}>
              <Select
                placeholder="选择状态"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                style={{ width: '100%' }}
                allowClear
              >
                {statusOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={3}>
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                筛选
              </Button>
            </Col>
            <Col xs={12} sm={3}>
              <Button onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </div>
      </div>

      <Card
        className="kb-card"
        title={<span>知识条目 ({dataSource.length})</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加知识
          </Button>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title={editingItem ? '编辑知识条目' : '添加知识条目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={720}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="question"
            label="问题"
            rules={[{ required: true, message: '请输入问题' }]}
          >
            <Input placeholder="输入可能被问到的问题" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="答案"
            rules={[{ required: true, message: '请输入答案' }]}
          >
            <TextArea
              rows={6}
              placeholder="输入问题的详细答案"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="选择分类">
                  {categoryOptions.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
                initialValue="active"
              >
                <Select placeholder="选择状态">
                  {statusOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="标签"
            help="多个标签请用逗号分隔"
          >
            <Input
              placeholder="例如：技术,客户服务,常见问题"
              prefix={<TagsOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeBasePage; 