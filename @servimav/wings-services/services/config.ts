import type { AxiosInstance } from 'axios'


export default function init(api: AxiosInstance) {
    const baseUrl = '/config'

    return {
        get: () => api.get<Config>(baseUrl),
        update: () => api.patch<Config>(baseUrl),
    }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Config {
    available: boolean
    accept_cup: boolean
    cup_usd: number
}
