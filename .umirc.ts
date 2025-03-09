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
  ],
  npmClient: 'pnpm',
  styles: [
    '@/assets/global.css',
  ],
});
