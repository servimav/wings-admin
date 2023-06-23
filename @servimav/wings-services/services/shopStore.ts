import type { AxiosInstance } from 'axios'
import { generateCrud } from '../crud'
import type { ShopOffer } from './shopOffer'
import type { User } from './user'
import type { GeoCoords, GeoLocation, PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/stores'

  const crud = generateCrud<ShopStore, ShopStoreCreate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    mine: () => api.get<PaginatedData<ShopStore>>(`${baseUrl}/mine`),
    offers: (storeId: number) => api.get<ShopOffer[]>(`${baseUrl}/${storeId}/offers`),
    orders: (storeId: number) => api.get<PaginatedData<ShopStore>>(`${baseUrl}/${storeId}/orders`)
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
