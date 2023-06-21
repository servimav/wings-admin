import type { AxiosInstance } from 'axios'
import { generateCrudWithoutPaginate } from '../crud'
import type { PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/categories'

  const crud = generateCrudWithoutPaginate<ShopCategory, ShopCategoryCreate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    offers: (id: number, params: { currency?: string }) =>
      api.get<PaginatedData<ShopCategory>>(`${baseUrl}/${id}/offers`, { params })
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
  image?: string
  parent?: ShopCategory
}

export interface ShopCategoryCreate {
  name: string
  image?: string
  parent_id?: number
}
