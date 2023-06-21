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
    show: (id: number, params: { currency: string }) =>
      api.get<ShopOffer>(`${baseUrl}/${id}`, { params }),
    filter: (params: ShopOfferFilter) =>
      api.get<PaginatedData<ShopOffer>>(`${baseUrl}/filter`, { params })
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
}

export interface ShopOfferCreate extends Omit<ShopOffer, 'id' | 'categories' | 'store'> {
  store_id: number
  categories?: number[]
}

export interface ShopOfferFilter {
  search?: string
  store_id?: number
  currency?: CurrencyCode
  category_id?: number
}

export type CurrencyCode = 'BTC' | 'CUP' | 'EUR' | 'MLC' | 'TRX' | 'USD' | 'USDT'
