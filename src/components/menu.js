import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    DownOutlined,
    LogoutOutlined,
    BarChartOutlined,
    MessageOutlined,
    BookOutlined,
    ShareAltOutlined,
    SafetyCertificateOutlined,
    RocketOutlined
  } from '@ant-design/icons';

// 定义一个名为 menus 的常量，它是一个函数，返回一个包含多个菜单项的数组
const menus = () => {
    return [
        {
            path: '/login',
            component: './Login',
            layout: false,
        },
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/home',
            name: '首页',
            component: './Home',
            icon: <HomeOutlined />,
        },
        {
            path: '/users',
            name: '用户管理',
            component: './Users',
            icon: <UserOutlined />,
        },
        {
            path: '/roles',
            name: '角色管理',
            component: './Roles',
            icon: <TeamOutlined />,
        },
        {
            path: '/statistics',
            name: '统计分析',
            component: './Statistics',
            icon: <BarChartOutlined />,
        },
        {
            path: '/chat-history',
            name: '聊天记录',
            component: './ChatHistory',
            icon: <MessageOutlined />,
        },
        {
            path: '/knowledge-base',
            name: '知识库',
            component: './KnowledgeBase',
            icon: <BookOutlined />,
        },
        {
            path: '/feedback',
            name: '反馈管理',
            component: './Feedback',
            icon: <ShareAltOutlined />,
        },
        {
            path: '/modelMonitor',
            name: '模型监控',
            component: './ModelMonitor',
            icon: <RocketOutlined />,
        },
        {
            name: '安全防护',
            path: '/security',
            icon:<SafetyCertificateOutlined />,
          }
    ]
}
export default menus