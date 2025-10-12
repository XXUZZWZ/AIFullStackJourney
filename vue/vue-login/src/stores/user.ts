import { defineStore } from 'pinia'
import type { _GettersTree } from 'pinia'


interface UserState {
  username: string
  token: string
}

interface UserActions {
  setToken(token: string): void
  setUsername(username: string): void
}

type UserGetters = _GettersTree<UserState> & {
  isLogin(state: UserState): boolean
}


export const useUserStore = defineStore<'user', UserState, UserGetters, UserActions>('user', {
  state: (): UserState => ({
    username: localStorage.getItem('username') || '',
    token: localStorage.getItem('token') || '',
  }),
  // 计算属性 本来就是依赖响应式状态计算后的结果
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      console.log('token', token)
    },
    setUsername(username: string) {
      this.username = username
      localStorage.setItem('username', username)
      console.log('username', username)
    }
  },

  getters: {
    isLogin(): boolean {
      return !!this.token
    },
  }
})