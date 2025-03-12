// 运行时配置
import { history } from 'umi';
import menus from './components/menu';

const menuRoutes = typeof menus === 'function' ? menus() : menus;

// 路由变化时的处理函数
export function onRouteChange({ location }: any) {
  // 如果路径不在有效路径列表中，重定向到404页面
  if (!menuRoutes.map(item => item.path).includes(location.pathname) && location.pathname !== '/404') {
    history.push('/404');
  }
}