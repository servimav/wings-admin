import type { AxiosInstance } from 'axios'
import { generateCrudWithoutPaginate } from '../crud'

export default function init(api: AxiosInstance) {
  const baseURL = '/currency'

  const crud = generateCrudWithoutPaginate<Currency>({ api, baseURL })

  return {
    ...crud
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Currency {
  id: number
  code: string
  name: string
  available: boolean
  price: number
}
