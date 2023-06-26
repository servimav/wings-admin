/**
 * @interface PaginatedData
 */
export interface PaginatedData<T> {
  data: T[]
  links: {
    first?: string
    last?: string
    prev?: string
    next?: string
  }
  meta: {
    current_page?: number
    from?: number
    path?: string
    per_page?: number
    to?: number
  }
}

export interface GeoCoords {
  latitude: number
  longitude: number
}

export interface GeoLocation {
  id: number
  name: string
  coords: GeoCoords
}

export interface KeyValue {
  key: string
  value: string | number
}

export interface PaginationParams {
  page?: number
}
