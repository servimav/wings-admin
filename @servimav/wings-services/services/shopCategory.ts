import type { AxiosInstance } from 'axios'
import { generateCrudWithoutPaginate } from '../crud'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/categories'

  const crud = generateCrudWithoutPaginate<ShopCategory>({
    api,
    baseUrl
  })

  return {
    ...crud
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface ShopCategory {
  id: number
  name: string
}
