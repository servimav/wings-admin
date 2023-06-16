import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ShopCategory, ShopOffer } from '@servimav/wings-services'
import { useServices } from '@/services'

const STORE_NAME = 'offer'
const $service = useServices()

export const useOfferStore = defineStore(STORE_NAME, () => {
  const categories = ref<ShopCategory[]>([])
  const offers = ref<ShopOffer[]>([])

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

  return {
    // data
    categories,
    offers,
    // Methods
    getCategories
  }
})
