import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
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
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/home',
          name: '首页',
          component: './Home',
        },
        {
          path: '/users',
          name: '用户管理',
          component: './Users',
        },
        {
          path: '/roles',
          name: '角色管理',
          component: './Roles',
        },
        {
          path: '/statistics',
          name: '统计分析',
          component: './Statistics',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
  styles: [
    '@/assets/global.css',
  ],
});
