import type { AxiosInstance } from 'axios'
import type { GeoCoords, GeoLocation } from './geoLocation'
import type { ShopOffer } from './shopOffer'
import type { User } from './user'
import { generateCrud } from '../crud'
import type { PaginatedData, PaginationParams } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/stores'

  const crud = generateCrud<ShopStore, ShopStoreCreate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    mine: (params?: PaginationParams) =>
      api.get<PaginatedData<ShopStore>>(`${baseUrl}/mine`, { params }),
    offers: (storeId: number, params?: PaginationParams) =>
      api.get<PaginatedData<ShopOffer>>(`${baseUrl}/${storeId}/offers`, { params }),
    orders: (storeId: number, params?: PaginationParams) =>
      api.get<PaginatedData<ShopStore>>(`${baseUrl}/${storeId}/orders`, { params })
  }
}

export interface ShopStore {
  id: number
  owner: User
  location: GeoLocation
  name: string
  description?: string
  contact_phone?: string
  contact_email?: string
  contact_url?: string
  image?: string
  address?: string
  coords?: GeoCoords
  available: boolean
  // Meta
  rating: number
}

export interface ShopStoreCreate extends Omit<ShopStore, 'id' | 'owner' | 'location' | 'rating'> {
  location_id: number
}
