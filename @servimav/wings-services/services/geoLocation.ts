import type { AxiosInstance } from 'axios'
import { generateCrud } from '../crud'

export default function init(api: AxiosInstance) {
  const baseUrl = '/location'

  const crud = generateCrud<GeoLocation, GeoLocationCreate>({
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

export interface GeoCoords {
  latitude: number
  longitude: number
}

export interface GeoLocation {
  id: number
  name: string
  coords?: GeoCoords
  parent?: GeoLocation
  children?: GeoLocation[]
  delivery_price?: number
}
export interface GeoLocationCreate extends Omit<GeoLocation, 'id' | 'parent' | 'children'> {
  parent_id?: number
}
