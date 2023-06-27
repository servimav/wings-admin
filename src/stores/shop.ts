import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  STOCK_TYPE,
  type Currency,
  type ShopCategory,
  type ShopStore,
  type PaginationParams
} from '@servimav/wings-services'
import { useServices } from '@/services'

const STORE_NAME = 'shop'
const $service = useServices()

export const useShopStore = defineStore(STORE_NAME, () => {
  const categories = ref<ShopCategory[]>([])
  const currencies = ref<Currency[]>([])
  const stockType: STOCK_TYPE[] = [STOCK_TYPE.INFINITY, STOCK_TYPE.LIMITED, STOCK_TYPE.OUT]
  const stores = ref<ShopStore[]>([])

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * getCategories
   */
  async function getCategories() {
    categories.value = (await $service.shop.category.list()).data
    return categories.value
  }

  /**
   * getCurrencies
   */
  async function getCurrencies() {
    currencies.value = (await $service.currency.list()).data
  }

  /**
   * getMyStores
   * @param params
   */
  async function getMyStores(params?: PaginationParams) {
    stores.value = (await $service.shop.store.mine(params)).data.data
    return stores.value
  }

  return {
    // data
    categories,
    currencies,
    stockType,
    stores,
    // Methods
    getCategories,
    getCurrencies,
    getMyStores
  }
})
