import type { AxiosInstance } from 'axios'
import { generateCrudWithoutPaginate } from '../crud'
import type { PaginatedData } from '..'

export default function init(api: AxiosInstance) {
  const baseURL = '/announcement'

  const crud = generateCrudWithoutPaginate<Announcement>({
    api,
    baseURL
  })

  return {
    ...crud,
    filter: () => api.get<PaginatedData<Announcement>>(`${baseURL}/filter`)
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Announcement {
  id: number
  name: string
  content: string
  image?: string
  type: 'image'
  available: boolean
  link: string
  target: '_blank' | '_self'
  level: number
}
