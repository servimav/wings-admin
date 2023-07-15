import type { AxiosInstance } from 'axios'
import type { TokenHandler } from '../tokenHandler'
import { generateCrud } from '../crud'

export default function init({ api, tokenHandler }: InitProps) {
  const baseURL = '/users'

  const crud = generateCrud<User>({
    api,
    baseURL
  })

  return {
    ...crud,
    login: async (params: UserLogin) => {
      const resp = await api.post<UserAuthResponse>(`${baseURL}/login`, params)
      tokenHandler.setToken(resp.data.auth_token)
      return resp
    },
    me: () => api.get<User>(`${baseURL}/me`),
    register: async (params: UserRegister) => {
      const resp = await api.post<UserAuthResponse>(`${baseURL}/register`, params)
      tokenHandler.setToken(resp.data.auth_token)
      return resp
    }
  }
}

interface InitProps {
  api: AxiosInstance
  tokenHandler: TokenHandler
}

export interface User {
  id: number
  name: string
  email?: string
  phone: string
  phone_verified_at?: string
  roles: UserRole[]
}

export interface UserRole {
  id: number
  name: string
}

export interface UserLogin {
  phone: string
  password: string
}

export interface UserRegister extends UserLogin {
  name: string
  password: string
  password_confirmation: string
}

export interface UserAuthResponse {
  auth_token: string
  data: User
}
