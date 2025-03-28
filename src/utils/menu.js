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
            layout: false,
        },
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/home',
            name: '首页',
            icon: <HomeOutlined />,
        },
        {
            path: '/users',
            name: '用户管理',
            icon: <UserOutlined />,
        },
        {
            path: '/roles',
            name: '角色管理',
            icon: <TeamOutlined />,
        },
        {
            name: '声纹识别',
            path: '/voiceprint',
            icon: <SafetyCertificateOutlined />,
        },
        {
            name: '表情包管理',
            path: '/emoji',
            icon: <SafetyCertificateOutlined />,
        },
        {
            path: '/statistics',
            name: '统计分析',
            icon: <BarChartOutlined />,
        },
        {
            path: '/chathistory',
            name: '聊天记录',
            icon: <MessageOutlined />,
        },
        {
            path: '/knowledgebase',
            name: '知识库',
            icon: <BookOutlined />,
        },
        {
            path: '/feedback',
            name: '反馈管理',
            icon: <ShareAltOutlined />,
        },
        {
            path: '/modelMonitor',
            name: '模型监控',
            icon: <RocketOutlined />,
        },
        {
            name: '安全防护',
            path: '/security',
            icon: <SafetyCertificateOutlined />,
        },
        {
            name: '权限管理',
            path: '/permissions',
            icon: <SafetyCertificateOutlined />,
        },
        {
            path: '/profile',
            name: '个人资料',
            icon: <SafetyCertificateOutlined />,
        },
    ]
}
export default menus