import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import { Link, Outlet, useLocation, history,useNavigate } from 'umi';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined, 
} from '@ant-design/icons';
import './index.less';
import '@/assets/global.css';
import { isUserLoggedIn, getCurrentUser, logout } from '@/utils/common';
import menus from "@/utils/menu";

const { Header, Sider, Content } = Layout;

const menuRoutes = typeof menus === 'function' ? menus() : menus;

const BasicLayout = () => {
  // 定义侧边栏折叠状态
  const [collapsed, setCollapsed] = useState(false);
  // 定义当前用户信息
  const [currentUser, setCurrentUser] = useState(null);
  // 获取当前路由位置
  const location = useLocation();
  // 获取路由导航函数
  const navigate = useNavigate();


  // 在组件挂载和路由变化时执行
  useEffect(() => {
    // 如果用户未登录且当前路由不是登录页，则跳转到登录页
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

  // 处理登出逻辑
  const handleLogout = () => {
    logout();
  };

  // 处理跳转到个人中心
  const handprofile = () => {
    history.push('/profile')
  }

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true
    }
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // 处理登出逻辑
        navigate('/login');
        break;
      default:
        break;
    }
  };

  // 根据路由配置生成菜单项
  const menuItems = menuRoutes.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.name}</Link>,
  })).filter((item) => !(item.key == '/login' || item.key == "/"));

  // 如果当前路由是登录页，则直接渲染子组件
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
                <Dropdown menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick
                }} trigger={['hover']}>
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
