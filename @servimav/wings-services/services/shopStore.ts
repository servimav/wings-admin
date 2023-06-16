import type { AxiosInstance } from 'axios'
import type { User } from './user'
import { generateCrud } from '../crud'
import type { GeoCoords, GeoLocation } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/stores'

  const crud = generateCrud<ShopStore, ShopStoreCreate>({
    api,
    baseUrl
  })

  return {
    ...crud
  }
}

export interface ShopStore {
  id: number
  owner: User
  location: GeoLocation
  name: string
  description?: string
  phone?: string
  email?: string
  image?: string
  address?: string
  coords?: GeoCoords
  available: boolean
}

export interface ShopStoreCreate extends Omit<ShopStore, 'id' | 'owner' | 'location'> {
  location_id: string
}
