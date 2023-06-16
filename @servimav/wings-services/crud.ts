import type { AxiosInstance } from 'axios'
import type { PaginatedData } from './types'

/**
 * generateCrud
 * @param param GenerateCrudParams
 * @returns
 */
function generateCrud<T, C = Omit<T, 'id'>, U = Partial<C>>({ api, baseUrl }: GenerateCrudParams) {
  return {
    list: () => api.get<PaginatedData<T>>(baseUrl),
    show: (id: number) => api.get<T>(`${baseUrl}/${id}`),
    create: (params: C) => api.post<T>(`${baseUrl}`, params),
    update: (id: number, params: U) => api.patch<T>(`${baseUrl}/${id}`, params),
    remove: (id: number) => api.delete(`${baseUrl}/${id}`)
  }
}

/**
 * generateCrudWithoutPaginate
 * @param param GenerateCrudParams
 * @returns
 */
function generateCrudWithoutPaginate<T, C = Omit<T, 'id'>, U = Partial<C>>({
  api,
  baseUrl
}: GenerateCrudParams) {
  return {
    list: () => api.get<T[]>(baseUrl),
    show: (id: number) => api.get<T>(`${baseUrl}/${id}`),
    create: (params: C) => api.post<T>(`${baseUrl}`, params),
    update: (id: number, params: U) => api.patch<T>(`${baseUrl}/${id}`, params),
    remove: (id: number) => api.delete(`${baseUrl}/${id}`)
  }
}

interface GenerateCrudParams {
  api: AxiosInstance
  baseUrl: string
}

export { generateCrud, generateCrudWithoutPaginate }
