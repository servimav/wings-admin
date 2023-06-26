import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  STOCK_TYPE,
  type Currency,
  type ShopCategory,
  type ShopOffer,
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
  const stores = ref<ShopStoreExtended[]>([])

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

  /**
   * getStoreOffers
   * @param storeId
   * @param params
   */
  async function getStoreOffers(storeId: number, params?: PaginationParams) {
    const resp = (await $service.shop.store.offers(storeId, params)).data
    // search store
    const storeIndex = stores.value.findIndex((store) => store.id === storeId)
    if (storeIndex >= 0) {
      // update pagination meta
      stores.value[storeIndex].offerPage = resp.meta.current_page
      // if store has offers push
      if (stores.value[storeIndex].offers && stores.value[storeIndex].offers?.length)
        stores.value[storeIndex].offers?.push(...resp.data)
      // if store has not offers assign
      else stores.value[storeIndex].offers = resp.data
    }
    return resp
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
    getMyStores,
    getStoreOffers
  }
})

export interface ShopStoreExtended extends ShopStore {
  offers?: ShopOffer[]
  offerPage?: number
}
