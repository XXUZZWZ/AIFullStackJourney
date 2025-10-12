import { MockMethod } from 'vite-plugin-mock'

// 用户相关接口
export default [
  // 用户登录
  {
    url: '/api/login',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          token: 'mock-token-123456',
          username: 'admin',
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: '',
            roles: ['admin']
          }
        }
      }
    }
  },

  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: '',
          roles: ['admin'],
          permissions: ['user:view', 'user:edit']
        }
      }
    }
  },

  // 用户退出登录
  {
    url: '/api/logout',
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: null
      }
    }
  },

  // 获取用户列表
  {
    url: '/api/user/list',
    method: 'get',
    timeout: 800,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          total: 15,
          list: [
            {
              id: 1,
              username: 'admin',
              nickname: '管理员',
              status: 1,
              createTime: '2024-01-01 10:00:00'
            },
            {
              id: 2,
              username: 'user1',
              nickname: '用户1',
              status: 1,
              createTime: '2024-01-02 14:30:00'
            }
          ]
        }
      }
    }
  }
] as MockMethod[]