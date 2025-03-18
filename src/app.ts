import { history } from 'umi';

interface RouteChangeParams {
  location: {
    pathname: string;
    [key: string]: any;
  };
  routes: Array<{
    path: string;
    [key: string]: any;
  }>;
  action: string;
}

export function onRouteChange({ location, routes, action }: RouteChangeParams) {
  // 在这里可以做路由变化时的处理
  console.log('route change', location.pathname);
}

export const request = {
  timeout: 10000,
  errorConfig: {
    errorHandler: (error: any) => {
      console.log(error);
    },
    errorThrower: (res: any) => {
      const { success, data, errorCode, errorMessage } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, data };
        throw error;
      }
    },
  },
  requestInterceptors: [],
  responseInterceptors: [],
};

export async function getInitialState() {
  const userInfo = localStorage.getItem('userInfo');
  return {
    currentUser: userInfo ? JSON.parse(userInfo) : undefined,
  };
} 