// 检查用户是否已经登录
export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

// 获取当前登录的用户信息
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  }
  return null;
}

// 登出
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
} 