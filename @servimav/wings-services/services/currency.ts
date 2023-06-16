import type { AxiosInstance } from 'axios'
import { generateCrud } from '../crud'

export default function init(api: AxiosInstance) {
  const baseUrl = '/currency'

  const crud = generateCrud<Currency>({ api, baseUrl })

  return {
    get: () => api.get<Currency>(baseUrl),
    update: () => api.patch<Currency>(baseUrl)
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Currency {
  code: string
  name: string
  available: boolean
  price: number
}
