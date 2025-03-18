import m_request from './m_request';
import Config from "./config";
import Api from './api';

/**
 * 创建API请求方法
 * @param {string} baseURL - API基础URL
 * @param {Object} defaultOptions - 默认配置
 * @returns {Object} API方法集合
 */
const createAPI = (endpoint, defaultOptions = {}) => {
  let ApiName = Api[endpoint]
  return {
    /**
     * GET请求
     * @param {string} url - 接口地址
     * @param {Object} params - 查询参数
     * @param {Object} options - 请求配置
     */
    get: (data = {}, options = {}) => {
      const queryString = new URLSearchParams(data).toString();
      const url = `${Config.BASE_URL}${ApiName}${queryString ? `?${queryString}` : ''}`;
      return m_request(url, {
        method: 'GET',
        data,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * POST请求
     * @param {string} url - 接口地址
     * @param {Object} data - 请求数据
     * @param {Object} options - 请求配置
     */
    post: (data = {}, options = {}) => {
      return m_request(`${Config.BASE_URL}${ApiName}`, {
        method: 'POST',
        data,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * PUT请求
     * @param {string} url - 接口地址
     * @param {Object} data - 请求数据
     * @param {Object} options - 请求配置
     */
    put: (data = {}, options = {}) => {
      return m_request(`${Config.BASE_URL}${ApiName}`, {
        method: 'PUT',
        data,
        ...defaultOptions,
        ...options
      });
    },

    /**
     * DELETE请求
     * @param {string} url - 接口地址
     * @param {Object} options - 请求配置
     */
    delete: (options = {}) => {
      return m_request(`${Config.BASE_URL}${ApiName}`, {
        method: 'DELETE',
        ...defaultOptions,
        ...options
      });
    },

    /**
     * PATCH请求
     * @param {string} url - 接口地址
     * @param {Object} data - 请求数据
     * @param {Object} options - 请求配置
     */
    patch: (data = {}, options = {}) => {
      return m_request(`${Config.BASE_URL}${ApiName}`, {
        method: 'PATCH',
        data,
        ...defaultOptions,
        ...options
      });
    }
  };
};

/**
 * 用户相关API
 */
export const request = {
  // 获取用户列表
  getlist: (endpoint, payload = { results: 10 }, options = {}) => {
    const api = createAPI(endpoint, {
      timeout: 15000 // 针对用户API设置更长的超时时间w
    });
    return api.get(payload, options);
  },

  // 获取单个用户
  getinfo: (endpoint, payload) => {
    const api = createAPI(endpoint);
    return api.get(endpoint, payload);
  },

  // 创建用户
  create: (endpoint, payload) => {
    const api = createAPI(endpoint);
    return api.post(endpoint, payload);
  },

  // 更新用户
  update: (endpoint, userId, payload) => {
    const api = createAPI(endpoint);
    return api.put(endpoint, `/${userId}`, payload);
  },

  // 删除用户
  delete: (endpoint, payload) => {
    const api = createAPI(endpoint);
    return api.delete(endpoint, payload);
  }
};


export default request