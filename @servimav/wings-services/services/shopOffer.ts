import type { AxiosInstance } from 'axios'
import type { ShopCategory } from './shopCategory'
import type { ShopStore } from './shopStore'
import { generateCrud } from '../crud'
import type { STOCK_TYPE } from '../const'
import type { KeyValue, PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/offers'

  const crud = generateCrud<ShopOffer, ShopOfferCreate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    filter: (params: ShopOfferFilter) =>
      api.get<PaginatedData<ShopOffer>>(`${baseUrl}/filter`, { params }),
    filterAdvanced: (params: ShopOfferFilter) =>
      api.get<PaginatedData<ShopOffer>>(`${baseUrl}/filter-advanced`, { params }),
    show: (id: number, params: { currency: string }) =>
      api.get<ShopOffer>(`${baseUrl}/${id}`, { params }),
    showClient: (id: number, params: { currency: string }) =>
      api.get<ShopOffer>(`${baseUrl}/${id}/show-client`, { params }),
    showSimilar: (id: number, params: { currency: string; sort?: SortFilterType }) =>
      api.get<ShopOffer[]>(`${baseUrl}/${id}/similar`, { params })
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface ShopOffer {
  id: number
  // Relations
  categories?: ShopCategory[]
  store?: ShopStore
  // Remotes
  remote_url?: string
  min_delivery_days?: number
  // data
  name: string
  description?: string
  image?: string
  gallery?: string[]
  attributes?: KeyValue[]
  available: boolean
  // price
  discount_price?: number
  production_price?: number
  sell_price: number
  // stock
  stock_type: STOCK_TYPE
  stock_qty: number
  // Meta
  rating: number
  views: number
}

export interface ShopOfferCreate
  extends Omit<ShopOffer, 'id' | 'categories' | 'store' | 'rating' | 'views'> {
  store_id: number
  categories?: number[]
}

export interface ShopOfferFilter {
  search?: string
  store_id?: number
  currency?: CurrencyCode
  category_id?: number
  sort?: SortFilterType
}

export type CurrencyCode = 'BTC' | 'CUP' | 'EUR' | 'MLC' | 'TRX' | 'USD' | 'USDT'
export type SortFilterType = 'id' | 'price' | 'rating' | 'views'
