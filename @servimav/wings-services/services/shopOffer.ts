import type { AxiosInstance } from 'axios'
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

export interface ShopOfferCreate extends Omit<ShopOffer, 'id' | 'category' | 'store'> {
  store_id: number
}

export interface ShopOfferFilter {
  search?: string
  store_id?: number
  currency?: CurrencyCode
  category_id?: number
}

export type CurrencyCode = 'BTC' | 'CUP' | 'EUR' | 'MLC' | 'TRX' | 'USD' | 'USDT'
