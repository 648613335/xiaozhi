/*
 * PageName: 
 * Autor: 崔皓然
 * Description: 
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Upload,
  Avatar,
  Select,
  Tabs,
  Spin,
  Space
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { getCurrentUser, updateUserProfile, updatePassword } from '@/utils/auth';

const { Option } = Select;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // 加载用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setUserProfile(user);
          form.setFieldsValue({
            name: user.name,
            phone: user.phone,
            email: user.email,
            gender: user.gender || '男'
          });
        }
      } catch (error) {
        message.error('获取用户信息失败');
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserInfo();
  }, [form]);

  // 处理基本信息更新
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      await updateUserProfile(values);
      setUserProfile({ ...userProfile, ...values });
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理密码修改
  const handleUpdatePassword = async (values) => {
    try {
      setLoading(true);
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar
                size={100}
                src={userProfile?.avatar}
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  // 处理头像上传逻辑
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('只能上传JPG/PNG格式的图片!');
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error('图片必须小于2MB!');
                  }
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              style={{ maxWidth: '500px', margin: '0 auto' }}
            >
              <Form.Item
                name="name"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                  <Option value="保密">保密</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="修改密码" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
              style={{ maxWidth: '500px', margin: '0 auto' }}
            >
              <Form.Item
                name="oldPassword"
                label="原密码"
                rules={[{ required: true, message: '请输入原密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入原密码"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能小于6位' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入新密码"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请确认新密码"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage; 