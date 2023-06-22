import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  STOCK_TYPE,
  type Currency,
  type ShopCategory,
  type ShopOffer,
  type ShopStore
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
  async function getMyStores(page = 1) {
    stores.value = (await $service.shop.store.mine()).data.data
  }

  /**
   * getStoreOffers
   * @param storeId
   * @param page
   */
  async function getStoreOffers(storeId: number, page = 1) {
    const resp = await $service.shop.store.offers(storeId)
    // search store
    const storeIndex = stores.value.findIndex((store) => store.id === storeId)
    if (storeIndex >= 0) {
      stores.value[storeIndex].offers = resp.data
    }
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
}
