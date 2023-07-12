import type { AxiosInstance } from 'axios'
import type { PaginatedData, PaginationParams } from './types'

/**
 * generateCrud
 * @param param GenerateCrudParams
 * @returns
 */
function generateCrud<T, C = Omit<T, 'id'>, U = Partial<C>>({ api, baseURL }: GenerateCrudParams) {
  return {
    list: (params?: PaginationParams) => api.get<PaginatedData<T>>(baseURL, { params }),
    show: (id: number) => api.get<T>(`${baseURL}/${id}`),
    create: (params: C) => api.post<T>(`${baseURL}`, params),
    update: (id: number, params: U) => api.patch<T>(`${baseURL}/${id}`, params),
    remove: (id: number) => api.delete(`${baseURL}/${id}`)
  }
}

/**
 * generateCrudWithoutPaginate
 * @param param GenerateCrudParams
 * @returns
 */
function generateCrudWithoutPaginate<T, C = Omit<T, 'id'>, U = Partial<C>>({
  api,
  baseURL
}: GenerateCrudParams) {
  return {
    list: () => api.get<T[]>(baseURL),
    show: (id: number) => api.get<T>(`${baseURL}/${id}`),
    create: (params: C) => api.post<T>(`${baseURL}`, params),
    update: (id: number, params: U) => api.patch<T>(`${baseURL}/${id}`, params),
    remove: (id: number) => api.delete(`${baseURL}/${id}`)
  }
}

interface GenerateCrudParams {
  api: AxiosInstance
  baseURL: string
}

export { generateCrud, generateCrudWithoutPaginate }
