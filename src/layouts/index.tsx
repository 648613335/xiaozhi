import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import { Link, Outlet, useLocation, history } from 'umi';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './index.less';
import '@/assets/global.css';
import { isUserLoggedIn, getCurrentUser, logout } from '@/utils/auth';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // 检查用户是否已登录
    if (!isUserLoggedIn() && location.pathname !== '/login') {
      history.push('/login');
      return;
    }
    
    // 获取当前用户信息
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: <Link to="/home">首页</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">用户管理</Link>,
    },
    {
      key: '/roles',
      icon: <TeamOutlined />,
      label: <Link to="/roles">角色管理</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
            <div
              style={{
                padding: '0 24px',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'color 0.3s',
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            
            {currentUser && (
              <div style={{ marginRight: 24 }}>
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar src={currentUser.avatar} />
                    <span>{currentUser.name}</span>
                    <DownOutlined style={{ fontSize: 12 }} />
                  </Space>
                </Dropdown>
              </div>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
