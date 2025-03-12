// auth.ts - 用户认证工具函数

// 检查用户是否已经登录
export const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('token');
};

// 获取当前登录的用户信息
export const getCurrentUser = () => {
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
};

// 更新用户信息
export const updateUserProfile = async (userData: any) => {
    try {
        // 模拟API调用，实际项目应替换为真实API
        return new Promise(resolve => {
            setTimeout(() => {
                const currentUser = getCurrentUser();
                const updatedUser = { ...currentUser, ...userData };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                resolve(updatedUser);
            }, 1000);
        });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
    }
};

// 更新用户密码
export const updatePassword = async (passwordData: {
    oldPassword: string;
    newPassword: string;
}) => {
    try {
        // 模拟API调用，实际项目应替换为真实API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 在实际应用中，这里需要验证原密码是否正确
                if (passwordData.oldPassword && passwordData.newPassword) {
                    // 密码更新逻辑
                    resolve(true);
                } else {
                    reject(new Error('密码更新失败'));
                }
            }, 1000);
        });
    } catch (error) {
        console.error('更新密码失败:', error);
        throw error;
    }
};

// 登出
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
};

// 模拟登录函数
export const login = async (username: string, password: string) => {
    // 模拟API调用，实际项目应替换为真实API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username && password) {
                // 模拟成功登录
                const mockUser = {
                    id: '1',
                    name: '测试用户',
                    phone: '13800138000',
                    email: 'test@example.com',
                    gender: '男',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                };
                localStorage.setItem('token', 'mock-token-123456');
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                resolve(mockUser);
            } else {
                reject(new Error('用户名或密码错误'));
            }
        }, 1000);
    });
};