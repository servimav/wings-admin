import type { AxiosInstance } from 'axios'
import type { GeoCoords } from './geoLocation'
import type { CurrencyCode, ShopOffer } from './shopOffer'
import type { User } from './user'
import type { STATUS } from '../const'
import { generateCrud } from '../crud'
import type { PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/orders'

  const crud = generateCrud<ShopOrder, ShopOrderCreate, ShopOrderUpdate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    filter: (params: ShopOrderFilter) =>
      api.get<PaginatedData<ShopOrder>>(`${baseUrl}/filter`, { params }),
    mine: (params: Omit<ShopOrderFilter, 'customer_id' | 'location_id'>) =>
      api.get<PaginatedData<ShopOrder>>(`${baseUrl}/mine`, { params })
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

/**
 * ShopOrder
 */
export interface ShopOrder {
  id: number
  customer: User
  delivery_status: STATUS
  delivery_details: DeliveryDetails
  delivery_price: number
  offers_price: number
  service_price: number
  order_offers: OrderOffer[]
}

/**
 * ShopOrderCreate
 */
export interface ShopOrderCreate {
  order_offers: Array<OrderOfferCreate>
  delivery_details: DeliveryDetails
  currency?: CurrencyCode
}

/**
 * ShopOrderUpdate
 */
export interface ShopOrderUpdate {
  currency?: CurrencyCode
  delivery_status?: STATUS
  delivery_date?: string
}

/**
 * ShopOrderFilter
 */
export interface ShopOrderFilter {
  status?: STATUS
  currency?: CurrencyCode
  location_id?: number
  customer_id?: number
}

/**
 * OrderOffer
 */
export interface OrderOfferCreate {
  qty: number
  offer_id: number
}

/**
 * OrderOffer
 */
export interface OrderOffer {
  qty: number
  offer: ShopOffer
}

/**
 * DeliveryDetails
 */
export interface DeliveryDetails {
  name: string
  contact: string
  address: string
  coords?: GeoCoords
  location_id: number
}
