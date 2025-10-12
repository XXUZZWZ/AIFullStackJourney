import request from './request'

export interface LoginResponse {
  token: string
  username: string
}

export const login = (data: { username: string, password: string }): Promise<LoginResponse> => {
  return request.post('/login', data).then(res => res as unknown as LoginResponse)
}