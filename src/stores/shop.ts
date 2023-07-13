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

  const orderCounter = ref<OrderCounter>({
    accepted: 0,
    created: 0,
    onprogress: 0
  })
  const stockType: STOCK_TYPE[] = [
    STOCK_TYPE.INFINITY,
    STOCK_TYPE.LIMITED,
    STOCK_TYPE.OUT,
    STOCK_TYPE.INCOMMING
  ]
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
    orderCounter,
    stockType,
    stores,
    // Methods
    getCategories,
    getCurrencies,
    getMyStores
  }
})

export interface OrderCounter {
  created: number
  accepted: number
  onprogress: number
}
