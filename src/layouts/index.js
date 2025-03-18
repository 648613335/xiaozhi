import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import { Link, Outlet, useLocation, history } from 'umi';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './index.less';
import '@/assets/global.css';
import { isUserLoggedIn, getCurrentUser, logout } from '@/utils/common';
import menus from "@/components/menu";

const { Header, Sider, Content } = Layout;

const menuRoutes = typeof menus === 'function' ? menus() : menus;

const BasicLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!isUserLoggedIn() && location.pathname !== '/login') {
      history.push('/login');
      return;
    }

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const handprofile = () => {
    history.push('/profile')
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={handprofile}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const menuItems = menuRoutes.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.name}</Link>,
  })).filter((item) => !(item.key == '/login' || item.key == "/"));

  if (location.pathname === '/login') {
    return <Outlet />;
  }

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
                <Dropdown menu={userMenu} trigger={['click']}>
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
