import type { AxiosInstance } from 'axios'
import { generateCrudWithoutPaginate } from '../crud'

export default function init(api: AxiosInstance) {
	const baseUrl = '/shop/categories'

	const crud = generateCrudWithoutPaginate<ShopCategory, ShopCategoryCreate>({
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

export interface ShopCategory {
	id: number
	name: string
	image?: string
	parent?: ShopCategory
}

export interface ShopCategoryCreate {
	name: string
	image?: string
	parent_id?: number
}