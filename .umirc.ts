import { defineConfig } from '@umijs/max';
import path from 'path';
import stream from 'stream-browserify';
import crypto from 'crypto-browserify';
import buffer from 'buffer';
import util from 'util';

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
    {
      path: '/statistics',
      name: '统计分析',
      component: './Statistics',
    },
    {
      path: '/chat-history',
      name: '聊天记录',
      component: './ChatHistory',
    },
    {
      path: '/knowledge-base',
      name: '知识库',
      component: './KnowledgeBase',
    },
    {
      path: '/feedback',
      name: '反馈管理',
      component: './Feedback',
    },
    {
      path: '/profile',
      name: '个人资料',
      component: './Profile',
    },
    {
      path: '/modelMonitor',
      name: '模型监控',
      component: './ModelMonitor',
    },
    {
      path: '/security',
      name: '安全防护',
      component: './Security'
    },
    {
      path: '/404',
      component: './404',
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
  npmClient: 'npm',
  styles: [
    '@/assets/global.css',
  ],
  mfsu: false,
});