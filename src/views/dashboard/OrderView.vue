<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { STATUS, type OrderItem, type ShopOrder } from '@servimav/wings-services'
import { toCurrency } from '@/helpers'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
import { ROUTE_NAME } from '@/router'

interface OrderStatus {
  label: string
  class: string
}
/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const FloatButtonItem = defineAsyncComponent(
  () => import('@/components/buttons/FloatButtonItem.vue')
)
const BellIcon = defineAsyncComponent(() => import('@/components/icons/BellOutline.vue'))
const EditIcon = defineAsyncComponent(() => import('@/components/icons/EditPencilOutline.vue'))
const ChatIcon = defineAsyncComponent(() => import('@/components/icons/ChatIcon.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))
const OrderForm = defineAsyncComponent(() => import('@/components/forms/OrderForm.vue'))
/**
 * ------------------------------------------
 *	Composable
 * ------------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const loading = computed(() => $app.loading)

const order = ref<ShopOrder>()

const orderStatus = computed<OrderStatus | undefined>(() => {
  if (order.value) {
    switch (order.value.delivery_status) {
      case STATUS.ACCEPTED:
        return {
          class: '',
          label: 'Pagada y En Espera de Envío'
        }
      case STATUS.CANCELED_BY_CLIENT:
        return {
          class: '',
          label: 'Cancelada'
        }
      case STATUS.CANCELED_BY_PROVIDER:
        return {
          class: '',
          label: 'Cancelada'
        }
      case STATUS.COMPLETED:
        return {
          class: '',
          label: 'Completada'
        }
      case STATUS.CREATED:
        return {
          class: '',
          label: 'En espera de Pago'
        }
      case STATUS.ONPROGRESS:
        return {
          class: '',
          label: 'En Envio'
        }
    }
  }
  return undefined
})

const showFloatMenu = ref(false)
const showForm = ref(false)

const totalPrice = computed(
  () =>
    Number(order.value?.delivery_price) +
    Number(order.value?.offers_price) +
    Number(order.value?.service_price)
)

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */

/**
 * contact
 */
function contact() {
  if (order.value) {
    const phone = order.value.customer.phone
    const name = order.value.customer.name
    const message = `Hola ${name}`

    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.location.assign(whatsappLink)
  }
}

/**
 * getOrder
 */
async function getOrder() {
  const orderId = Number($route.params.orderId)
  $app.toggleLoading(true)
  try {
    const data = (
      await $service.shop.order.showClient(orderId, {
        currency: 'CUP'
      })
    ).data
    order.value = data

    console.log({
      order: order.value
    })
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * goToOffer
 * @param item
 */
function goToOffer(item: OrderItem) {
  console.log({ item })
  void $router.push({
    name: ROUTE_NAME.OFFER,
    params: {
      offerId: item.id
    }
  })
}
/**
 * onCancelUpdate
 */
function onCancelUpdate() {
  showFloatMenu.value = false
  showForm.value = false
}

/**
 * onClickEdit
 */
function onClickEdit() {
  showFloatMenu.value = false
  showForm.value = true
}

/**
 * onUpdate
 * @param updated
 */
function onOrderUpdate(updated: ShopOrder) {
  order.value = updated
  showFloatMenu.value = false
  showForm.value = false
}

/**
 * sendNotification
 */
function sendNotification() {
  if (order.value) {
    const phone = order.value.customer.phone
    const name = order.value.customer.name
    const message = `Hola ${name}.\nLe notifico que su orden con ID #${order.value.id} se encuentra en el estado "${orderStatus.value?.label}". Si desea ver más detalles puede revisar el link:\nhttps://wings.servimav.com/orders/${order.value.id}`

    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.location.assign(whatsappLink)
  }
}

onBeforeMount(() => {
  getOrder()
})
</script>

<template>
  <main class="container w-full select-none p-4 text-slate-900">
    <!-- Offer Form -->
    <template v-if="showForm">
      <OrderForm
        :order="(order as ShopOrder)"
        @canceled="onCancelUpdate"
        @updated="onOrderUpdate"
      />
    </template>
    <!-- / Offer Form -->

    <!-- Loading -->
    <div v-else-if="loading">
      <OfferSkeleton :repeat="1" />
    </div>

    <!-- / Offer Form -->
    <template v-else-if="order">
      <div class="text-right font-thin">Orden #{{ order.id }}</div>

      <div class="mt-2 space-y-2">
        <!-- Status -->
        <div class="border p-4">
          <ul class="list-none space-y-1">
            <li :class="orderStatus?.class">Estado: {{ orderStatus?.label }}</li>
            <li :class="orderStatus?.class">
              Tipo de pago: {{ order.payment_type === 'TRANSFER_PARTIAL' ? 'Parcial' : 'Total' }}
            </li>
            <li v-if="order.delivery_date">
              Entrega:
              {{
                new Date(order.delivery_date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }}
            </li>
            <li>Dirección: {{ order.delivery_details.address }}</li>
            <li>Destinatario: {{ order.delivery_details.name }}</li>
            <li>Teléfono: {{ order.delivery_details.contact }}</li>
          </ul>
        </div>
        <!-- / Status -->

        <!-- Prices -->
        <div class="border p-4">
          <ul class="list-none space-y-1">
            <li>Precio de Productos: {{ toCurrency(order.offers_price) }}</li>
            <li>
              Precio de Envío:
              {{
                order.delivery_price && order.delivery_price > 0
                  ? toCurrency(order.delivery_price)
                  : 'Gratis'
              }}
            </li>
            <li>Total: {{ toCurrency(totalPrice) }}</li>
          </ul>
        </div>
        <!-- / Prices -->

        <!-- Cart Items -->
        <div class="space-y-2 text-sm">
          <CaretOfferWidget
            v-for="(item, itemKey) in order.items"
            :key="`item-order-${itemKey}-${item.id}`"
            :item="item"
            @click-image="() => goToOffer(item)"
            readonly
            to-cup
          />
        </div>
        <!-- / Cart Items -->
      </div>
    </template>
  </main>

  <!-- Float Button -->
  <div class="fixed bottom-6 left-6 z-10" v-if="!showForm">
    <FloatButton v-model="showFloatMenu">
      <FloatButtonItem
        label="Editar"
        :icon="EditIcon"
        id="edit-order-button"
        @click="onClickEdit"
      />
      <FloatButtonItem
        label="Notificar"
        :icon="BellIcon"
        id="notify-client-button"
        @click="sendNotification"
      />
      <FloatButtonItem
        label="Contactar"
        :icon="ChatIcon"
        id="contact-client-button"
        @click="contact"
      />
    </FloatButton>
  </div>
  <!-- / Float Button -->
</template>
