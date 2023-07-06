<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import { STOCK_TYPE, type ShopOffer } from '@servimav/wings-services'
import { scrollTop, toCurrency, setDefaultImage, CUP_PRICE } from '@/helpers'
import { initModals } from 'flowbite'
import { ROUTE_NAME } from '@/router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const FloatButtonItem = defineAsyncComponent(
  () => import('@/components/buttons/FloatButtonItem.vue')
)
const IconEdit = defineAsyncComponent(() => import('@/components/icons/EditPencilOutline.vue'))
const IconDelete = defineAsyncComponent(() => import('@/components/icons/TrashOutline.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})
const loading = computed(() => $app.loading)
const offer = ref<ShopOffer>()
const shoForm = ref(false)
const showFloatMenu = ref(false)

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * load offer data from servers
 */
async function getOffer(offerId: number) {
  $app.toggleLoading(true)
  try {
    offer.value = (
      await $service.shop.offer.show(offerId, {
        currency: 'USD'
      })
    ).data
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * Navigate to store
 */
function goToParentStore() {
  $router.push({
    name: ROUTE_NAME.STORE,
    params: {
      storeId: offer.value?.store?.id
    }
  })
}

/**
 * onClickDelete
 */
async function onClickDelete() {
  $app.error('No esta permitido eliminar la oferta')
  showFloatMenu.value = false
}

/**
 * Handle edit button onClick event
 */
function onClickEdit() {
  shoForm.value = true
  showFloatMenu.value = false
}

/**
 * Handle Offer Form updated event
 * @param offer
 */
function onOfferUpdated(updatedOffer: ShopOffer) {
  offer.value = updatedOffer
  shoForm.value = false
  scrollTop()
}

onBeforeMount(async () => {
  scrollTop()
  const offerId = Number($route.params.offerId)
  await getOffer(offerId)

  if (offer.value) {
    setTimeout(() => {
      initModals()
    }, 500)
  } else {
    $app.error('No existe la oferta')
    goToParentStore()
  }
})
</script>

<template>
  <section class="p-2" v-if="offer">
    <!-- Offer Form -->
    <template v-if="shoForm">
      <OfferForm :update="offer" @updated="onOfferUpdated" @canceled="() => (shoForm = false)" />
    </template>
    <!-- / Offer Form -->

    <!-- Loading -->
    <div v-else-if="loading">
      <OfferSkeleton :repeat="1" />
    </div>
    <!-- / Offer Form -->

    <!-- Offer Data -->
    <div v-else class="p-2">
      <div class="relative mt-2 rounded-md bg-slate-100 p-4">
        <img
          :src="offer.image ?? '/images/default.png'"
          :alt="offer.name"
          :title="offer.name"
          @error="setDefaultImage"
        />

        <div class="absolute bottom-1 right-1 z-10">
          <div
            class="rounded-full border p-2 text-sm shadow-sm"
            :class="
              offer.available
                ? 'border-green-300 bg-green-500 text-white'
                : 'border-slate-400 bg-slate-300 text-black'
            "
          >
            {{ offer.available ? 'Disponible' : 'No disponible' }}
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-between gap-2 py-2 font-bold">
        <h2>#{{ offer.id }}</h2>
        <h2 class="mr-4" v-if="offer.views">{{ offer.views }} Vistas</h2>
        <h2 class="mr-4" v-if="offer.rating">{{ offer.rating }} Rating</h2>
      </div>
      <h2 class="mt-4 py-2 text-center text-xl font-bold">{{ offer.name }}</h2>

      <div
        class="mt-4 rounded-md border p-2 shadow-sm"
        v-if="offer.categories && offer.categories.length"
      >
        <h3 class="text-center text-lg font-semibold">Categorías</h3>
        <div class="mt-2 flex flex-wrap gap-2">
          <div
            v-for="(category, catKey) in offer.categories"
            :key="`category-${catKey}`"
            class="rounded-full border bg-slate-100 px-2 py-1 text-sm"
            :class="{ 'border-primary-700': catKey == 0 }"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- Descripcion -->
      <div class="mt-2 rounded-md border p-2 shadow-sm" v-if="offer.description">
        <h3 class="text-center text-lg font-semibold">Descripción</h3>
        <p class="text-justify">
          {{ offer.description }}
        </p>
      </div>
      <!-- / Descripcion -->

      <!-- Precios -->
      <div class="mt-2 rounded-md border p-2 shadow-sm">
        <h3 class="text-center text-lg font-semibold">Precios</h3>
        <ul class="mt-2 space-y-2">
          <li v-if="offer.inversion_price">
            Precio Inversión:
            <span class="font-semibold">{{ toCurrency(offer.inversion_price ?? 0, false) }}</span
            ><span class="fml-2"
              >({{ toCurrency((offer.inversion_price ?? 0) * cupPrice, false) }} CUP)</span
            >
          </li>
          <li>
            Precio Proveedor:
            <span class="font-semibold">{{ toCurrency(offer.provider_price ?? 0, false) }}</span>
            <span class="ml-2"
              >({{ toCurrency((offer.provider_price ?? 0) * cupPrice, false) }} CUP)</span
            >
          </li>

          <li v-if="offer.discount_price">
            Precio Descuento:
            <span class="font-semibold">{{ toCurrency(offer.discount_price, false) }}</span>
            <span class="ml-2">({{ toCurrency(offer.discount_price * cupPrice) }})</span>
          </li>

          <li :class="{ 'line-through': offer.discount_price && offer.discount_price > 0 }">
            Precio venta:
            <span class="font-semibold">{{ toCurrency(offer.sell_price, false) }}</span>
            <span class="ml-2">({{ toCurrency(offer.sell_price * cupPrice) }} CUP)</span>
          </li>

          <li>
            Ganancia:
            <span class="font-semibold">{{
              toCurrency(
                offer.discount_price && offer.discount_price > 0
                  ? offer.discount_price - Number(offer.provider_price)
                  : offer.sell_price - Number(offer.provider_price),
                false
              )
            }}</span>

            <span class="ml-2"
              >({{
                toCurrency(
                  (offer.discount_price && offer.discount_price > 0
                    ? offer.discount_price - Number(offer.provider_price)
                    : offer.sell_price - Number(offer.provider_price)) * cupPrice
                )
              }}
              CUP)</span
            >
          </li>
        </ul>
      </div>
      <!-- / Precios -->

      <!-- Inventario -->
      <div class="mt-2 rounded-md border p-2 shadow-sm">
        <h3 class="text-center text-lg font-semibold">Inventario</h3>
        <ul class="mt-2 space-y-2">
          <li>
            Inventario:
            <span class="font-semibold">{{ offer.stock_type }}</span>
          </li>
          <li v-if="offer.stock_type === STOCK_TYPE.LIMITED">
            Cantidad:
            <span class="font-semibold">{{ offer.stock_qty }}</span>
          </li>
        </ul>
      </div>
      <!-- / Inventario -->

      <!-- Attributes -->
      <div
        class="mt-2 rounded-md border p-2 shadow-sm"
        v-if="offer.attributes && offer.attributes.length"
      >
        <h3 class="text-center text-lg font-semibold">Atributos</h3>
        <ul class="space-y-2">
          <li v-if="offer.weight">
            Peso:
            <span class="pl-2 font-semibold">{{ offer.weight }} Lb</span>
          </li>
          <li v-for="(attr, attrKey) in offer.attributes" :key="`attr-${attrKey}`">
            {{ attr.key }}:
            <span class="pl-2 font-semibold">{{ attr.value }}</span>
          </li>
        </ul>
      </div>
      <!-- / Attributes -->

      <!-- Extra -->
      <div class="mt-2 rounded-md border p-2 shadow-sm">
        <h3 class="text-center text-lg font-semibold">Extra</h3>
        <ul class="mt-2 space-y-2">
          <li v-if="offer.remote_url">
            Url Remota:
            <a class="font-semibold" :href="offer.remote_url" target="_blank">Acceder</a>
          </li>
          <li v-if="offer.min_delivery_days">
            Demora de Envío Mínima:
            <span class="font-semibold">{{ offer.min_delivery_days }} días</span>
          </li>
        </ul>
      </div>
      <!-- / Inventario -->
    </div>
  </section>

  <!-- Float Button -->
  <div class="fixed bottom-6 left-6 z-10" v-if="!shoForm">
    <FloatButton v-model="showFloatMenu">
      <FloatButtonItem
        @click="onClickEdit"
        label="Editar"
        :icon="IconEdit"
        id="edit-offer-button"
      />
      <FloatButtonItem
        @click="onClickDelete"
        label="Eliminar"
        :icon="IconDelete"
        id="delete-offer-button"
      />
    </FloatButton>
  </div>

  <!-- / Float Button -->
</template>
