import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  STOCK_TYPE,
  type ShopCategory,
  type ShopOffer,
  type ShopStore
} from '@servimav/wings-services'
import { useServices } from '@/services'

const STORE_NAME = 'shop'
const $service = useServices()

export const useShopStore = defineStore(STORE_NAME, () => {
  const categories = ref<ShopCategory[]>([])
  const offers = ref<ShopOffer[]>([])
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
  }

  /**
   * getMyStores
   * @param params
   */
  async function getMyStores(page = 1) {
    stores.value = (await $service.shop.store.mine()).data.data
  }

  return {
    // data
    categories,
    offers,
    stockType,
    stores,
    // Methods
    getCategories,
    getMyStores
  }
})
