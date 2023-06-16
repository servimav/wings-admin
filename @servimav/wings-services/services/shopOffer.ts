import type { AxiosInstance } from 'axios'
import { generateCrud } from '../crud'
import type { ShopStore } from './shopStore'
import type { ShopCategory } from './shopCategory'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/offers'

  const crud = generateCrud<ShopOffer, ShopOfferCreate>({
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

export interface ShopOffer {
  id: number
  category: ShopCategory
  store: ShopStore
  // data
  remote_url?: string
  name: string
  description?: string
  image?: string
  gallery?: string[]
  available: boolean
  // price
  currency: CurrencyCode
  discount_price?: number
  production_price?: number
  sell_price: number
  // stock
  stock_type: string
  stock_qty: number
}

export interface ShopOfferCreate extends Omit<ShopOffer, 'id' | 'category' | 'store'> {
  category_id: number
  store_id: number
}

export type CurrencyCode = 'BTC' | 'CUP' | 'EUR' | 'MLC' | 'TRX' | 'USD' | 'USDT'
