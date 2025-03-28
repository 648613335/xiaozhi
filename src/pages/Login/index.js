import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './login.css';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    // 模拟登录请求
    try {
      // 这里是模拟登录，实际项目中应该调用API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单验证: 用户名是admin且密码是123456
      if (values.username === 'admin' && values.password === '123456') {
        // 登录成功
        localStorage.setItem('token', 'mock-token-123456');
        localStorage.setItem('currentUser', JSON.stringify({
          name: 'Admin',
          avatar: 'https://joeschmoe.io/api/v1/random',
          userId: '1',
          role: 'admin'
        }));
        message.success('登录成功！');
        // 跳转到首页
        history.push('/home');
      } else {
        // 登录失败
        message.error('用户名或密码错误！');
      }
    } catch (error) {
      message.error('登录失败，请重试！');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>后台管理系统</Title>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名 (admin)" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码 (123456)"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 