import type { AxiosInstance } from 'axios';
import type { TokenHandler } from '../tokenHandler';

export default function init({ api, tokenHandler }: InitProps) {
    const baseUrl = '/users'

    return {
        login: async (params: UserLogin) => {
            const resp = await api.post<UserAuthResponse>(`${baseUrl}/login`, params)
            tokenHandler.setToken(resp.data.auth_token)
            return resp
        },
        register: async (params: UserRegister) => {
            const resp = await api.post<UserAuthResponse>(`${baseUrl}/register`, params)
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
    email: string
    phone?: string
    roles: UserRole[]
}

export interface UserRole {
    id: number
    name: string
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserRegister extends Omit<User, 'id'> {
    password: string
    password_confirmation: string
}

export interface UserAuthResponse {
    auth_token: string
    user: User
}
