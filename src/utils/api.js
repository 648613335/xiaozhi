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



  // 角色管理相关接口
  'roles/list': 'roleslist',  // 获取角色列表
  'roles/query': 'rolesquery',  // 查询角色
  'roles/add': 'rolesadd',  // 添加角色
  'roles/edit': 'rolesedit',  // 编辑角色
  'roles/delete': 'rolesdelete',  // 删除角色



  // 声纹识别相关接口（重复定义）
  'voiceprint/list': 'voiceprintlist',  // 获取声纹列表
  'voiceprint/query': 'voiceprintquery',  // 查询声纹
  'voiceprint/add': 'voiceprintadd',  // 添加声纹
  'voiceprint/edit': 'voiceprintedit',  // 编辑声纹
  'voiceprint/delete': 'voiceprintdelete',  // 删除声纹




  // 聊天历史管理相关接口
  'chathistory/list': 'chathistorylist',  // 获取聊天历史列表
  'chathistory/query': 'chathistoryquery',  // 查询聊天历史
  'chathistory/add': 'chathistoryadd',  // 添加聊天历史
  'chathistory/edit': 'chathistoryedit',  // 编辑聊天历史
  'chathistory/delete': 'chathistorydelete',  // 删除聊天历史


};

export default api;