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
import { isUserLoggedIn, getCurrentUser, logout } from '@/utils/auth';
import menus from "@/components/menu";

const { Header, Sider, Content } = Layout;

const menuRoutes = typeof menus === 'function' ? menus() : menus;

// 定义一个名为 BasicLayout 的 React 组件，使用 React.FC 类型
const BasicLayout: React.FC = () => {
  // 使用 useState 钩子定义一个名为 collapsed 的状态变量，初始值为 false
  const [collapsed, setCollapsed] = useState(false);
  // 使用 useState 钩子定义一个名为 currentUser 的状态变量，初始值为 null，类型为 any
  const [currentUser, setCurrentUser] = useState<any>(null);
  // 使用 useLocation 钩子获取当前路由位置
  const location = useLocation();

  // 使用 useEffect 钩子，在组件挂载和 location.pathname 变化时执行
  useEffect(() => {
    // 检查用户是否已登录，如果未登录且当前路径不是 '/login'，则跳转到登录页面
    if (!isUserLoggedIn() && location.pathname !== '/login') {
      history.push('/login');
      return;
    }

    // 获取当前用户信息
    const user = getCurrentUser();
    // 如果用户信息存在，则更新 currentUser 状态
    if (user) {
      setCurrentUser(user);
    }
  }, [location.pathname]); // 依赖项为 location.pathname

  // 定义一个处理用户退出的函数
  const handleLogout = () => {
    logout(); // 调用 logout 函数执行退出操作
  };

  const handprofile=()=>{
    history.push('/profile')
  }

  // 定义用户菜单，包含个人资料和退出登录选项
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

  // 定义菜单项数组，包含首页、用户管理和角色管理
  const menuItems = menuRoutes.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.name}</Link>,
  })).filter((item) => !(item.key == '/login' || item.key == "/"));

  // 渲染组件的 JSX 结构
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
