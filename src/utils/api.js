// API接口配置
const api = {
  // 用户相关接口
  'users/list': 'api',  // 获取用户列表
  'users/info': 'api',  // 获取用户详情
  'users/create': 'api', // 创建用户
  'users/update': 'api', // 更新用户
  'users/delete': 'api', // 删除用户

  // 声纹识别相关接口
  'voiceprint/list': 'api',  // 获取声纹列表
  'voiceprint/create': 'api', // 创建声纹
  'voiceprint/update': 'api', // 更新声纹
  'voiceprint/delete': 'api', // 删除声纹

  // 表情包管理相关接口
  'emoji/list': 'api',  // 获取表情包列表
  'emoji/create': 'api', // 创建表情包
  'emoji/update': 'api', // 更新表情包
  'emoji/delete': 'api', // 删除表情包
  'emoji/upload': 'api', // 上传表情包图片

  'roles/list': 'rolesList',
  'roles/rolesquery': 'rolesquery',
  'roles/rolesadd': 'rolesadd',
  'roles/rolesedit': 'rolesedit',
  'roles/rolesdelete': 'rolesdelete',
};

export default api;