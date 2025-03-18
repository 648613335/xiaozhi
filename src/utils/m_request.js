import { message } from 'antd';

// 错误信息映射
const ERROR_MESSAGES = {
  timeout: '请求超时，请重试',
  network: '网络错误，请检查网络连接',
  default: '服务器错误，请稍后重试'
};

/**
 * 处理响应状态
 * @param {Response} response - fetch响应对象
 * @returns {Promise} 处理后的响应
 */
const checkStatus = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  error.code = response.status;

  // 处理不同的状态码
  switch (response.status) {
    case 401:
      error.message = '未授权，请重新登录';
      // 可以在这里处理登录过期逻辑
      break;
    case 403:
      error.message = '拒绝访问';
      break;
    case 404:
      error.message = '请求地址不存在';
      break;
    case 500:
      error.message = '服务器错误';
      break;
    default:
      error.message = `请求错误 ${response.status}`;
  }

  throw error;
};

/**
 * 超时处理
 * @param {number} timeout - 超时时间
 * @returns {Promise} 超时Promise
 */
const timeoutPromise = (timeout) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, timeout);
  });
};

/**
 * 通用请求函数
 * @param {string} url - 请求地址
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果
 */
// 导出一个名为request的异步函数，用于发送HTTP请求
export const request = async (url, options = {}) => {
  // 定义默认的请求选项，包括请求头和超时时间
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json', // 设置默认的请求头，指定内容类型为JSON
    },
    timeout: 10000, // 设置默认的超时时间
    ...options,
  };

  // 处理请求数据
  // if (defaultOptions.data) {
  //   // 如果存在请求数据，将其转换为JSON字符串并设置为请求体
  //   defaultOptions.body = JSON.stringify(defaultOptions.data);
  //   // 删除data属性，避免重复传递
  //   delete defaultOptions.data;
  // }
  try {
    // 同时发起请求和超时检测
    const response = await Promise.race([
      fetch(url, defaultOptions),
      timeoutPromise(defaultOptions.timeout)
    ]);

    // 检查响应状态
    await checkStatus(response);

    const data = await response.json();
    return data;
    // return { success: true, data };
  } catch (error) {
    // 错误处理
    let errorMessage = ERROR_MESSAGES.default;

    if (error.message === '请求超时') {
      errorMessage = ERROR_MESSAGES.timeout;
    } else if (error.message === 'Failed to fetch') {
      errorMessage = ERROR_MESSAGES.network;
    } else if (error.message) {
      errorMessage = error.message;
    }

    message.error(errorMessage);
    return {
      success: false,
      error: errorMessage,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
};

export default request;
