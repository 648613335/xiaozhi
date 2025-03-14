import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag, Switch, Input, Space, Badge } from 'antd';
import { LockOutlined, SafetyCertificateOutlined, EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import './security.css';

const { Title, Text } = Typography;

const SecurityPage = () => {
  // 状态管理
  const [tlsStatus, setTlsStatus] = useState(true);
  const [maskingStatus, setMaskingStatus] = useState(true);
  const [apiLatency, setApiLatency] = useState([]);
  const [systemLoad, setSystemLoad] = useState([]);
  const [autoScaling, setAutoScaling] = useState(true);

  // 模拟实时数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      // 模拟API延迟数据
      setApiLatency(prev => [...prev.slice(-9), Math.random() * 100 + 50]);
      // 模拟系统负载数据
      setSystemLoad(prev => [...prev.slice(-9), Math.random() * 80 + 20]);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // 隐私数据脱敏示例
  const maskData = {
    idCard: '330102199001011234',
    phone: '13912345678',
    email: 'example@company.com'
  };

  const maskIdCard = (id) => maskingStatus ? id.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2') : id;
  const maskPhone = (phone) => maskingStatus ? phone.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2') : phone;
  const maskEmail = (email) => maskingStatus ? email.replace(/^(.{2})(?:[^@]+)(@.*)$/, '$1***$2') : email;

  // 生成时间轴数据
  const generateTimeAxis = () => {
    return Array(10).fill('').map((_, i) => `${-9 + i}s`);
  };

  // 系统监控图表配置
  const getLatencyChartOption = () => ({
    title: { text: 'API响应延迟' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: generateTimeAxis()
    },
    yAxis: { type: 'value', name: 'ms' },
    series: [{
      data: apiLatency,
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  });

  const getLoadChartOption = () => ({
    title: { text: '系统负载' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: generateTimeAxis()
    },
    yAxis: { type: 'value', name: '%' },
    series: [{
      data: systemLoad,
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  });

  // 加密传输配置表格数据
  const encryptionColumns = [
    { title: '配置项', dataIndex: 'name', key: 'name' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? '启用' : '禁用'}
        </Tag>
      )
    },
    { title: '说明', dataIndex: 'description', key: 'description' }
  ];

  const encryptionData = [
    {
      key: '1',
      name: 'TLS 1.3',
      status: tlsStatus,
      description: '最新的TLS加密协议，提供更好的安全性和性能'
    },
    {
      key: '2',
      name: 'HTTPS强制跳转',
      status: true,
      description: '自动将HTTP请求重定向至HTTPS'
    },
    {
      key: '3',
      name: 'HSTS',
      status: true,
      description: '强制客户端使用HTTPS与服务器创建连接'
    }
  ];

  return (
    <div className="security-container">
      <Title level={2}>安全防护中心</Title>

      {/* 安全状态概览 */}
      <Row gutter={[16, 16]} className="status-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="TLS加密传输"
              value={tlsStatus ? '已启用' : '已禁用'}
              prefix={<LockOutlined />}
              valueStyle={{ color: tlsStatus ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="隐私数据脱敏"
              value={maskingStatus ? '已启用' : '已禁用'}
              prefix={<EyeOutlined />}
              valueStyle={{ color: maskingStatus ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均响应延迟"
              value={apiLatency.length ? Math.round(apiLatency[apiLatency.length - 1]) : 0}
              suffix="ms"
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="自动扩缩容"
              value={autoScaling ? '已启用' : '已禁用'}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: autoScaling ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 加密传输配置 */}
      <Card title="加密传输配置" className="section-card">
        <Table columns={encryptionColumns} dataSource={encryptionData} pagination={false} />
      </Card>

      {/* 隐私脱敏示例 */}
      <Card title="隐私脱敏示例" extra={
        <Space>
          <Text>脱敏开关：</Text>
          <Switch checked={maskingStatus} onChange={setMaskingStatus} />
        </Space>
      } className="section-card">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text>身份证号：{maskIdCard(maskData.idCard)}</Text>
          </Col>
          <Col span={8}>
            <Text>手机号码：{maskPhone(maskData.phone)}</Text>
          </Col>
          <Col span={8}>
            <Text>电子邮箱：{maskEmail(maskData.email)}</Text>
          </Col>
        </Row>
      </Card>

      {/* 系统监控 */}
      <Card title="系统监控" extra={
        <Space>
          <Text>自动扩缩容：</Text>
          <Switch checked={autoScaling} onChange={setAutoScaling} />
        </Space>
      } className="section-card">
        <Row gutter={16}>
          <Col span={12}>
            <ReactECharts option={getLatencyChartOption()} />
          </Col>
          <Col span={12}>
            <ReactECharts option={getLoadChartOption()} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SecurityPage; 