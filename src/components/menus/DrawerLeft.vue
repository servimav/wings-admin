<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { ELEMENT_ID } from '@/helpers'
import { ROUTE_NAME } from '@/router'
// Components
const ChartBarIcon = defineAsyncComponent(() => import('@/components/icons/ChartBarIcon.vue'))
const CartIcon = defineAsyncComponent(() => import('@/components/icons/CartIcon.vue'))
const ChatIcon = defineAsyncComponent(() => import('@/components/icons/ChatIcon.vue'))
const HomeIcon = defineAsyncComponent(() => import('@/components/icons/HomeIcon.vue'))
const OfferIcon = defineAsyncComponent(() => import('@/components/icons/OfferIcon.vue'))
const SettingIcon = defineAsyncComponent(() => import('@/components/icons/SettingIcon.vue'))
const SquaresIcon = defineAsyncComponent(() => import('@/components/icons/SquaresIcon.vue'))
const StoreIcon = defineAsyncComponent(() => import('@/components/icons/StoreIcon.vue'))
const UserIcon = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))

const elementId = ELEMENT_ID.DRAWER_LEFT

interface MenuItem {
  to?: RouteLocationRaw
  label: string
  icon: typeof ChartBarIcon
  badge?: string
}
/**
 * -----------------------------------------
 *	Helpers
 * -----------------------------------------
 */
const $router = useRouter()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const drawerItems: MenuItem[] = [
  {
    icon: HomeIcon,
    label: 'Inicio',
    to: { name: ROUTE_NAME.HOME }
  },
  {
    icon: SquaresIcon,
    label: 'Categorías',
    // badge: '5',
    to: { name: ROUTE_NAME.CATEGORIES }
  },
  {
    icon: StoreIcon,
    label: 'Tiendas',
    to: { name: ROUTE_NAME.STORES }
  },
  {
    icon: OfferIcon,
    label: 'Productos',
    to: { name: ROUTE_NAME.OFFERS }
  },
  {
    icon: CartIcon,
    label: 'Pedidos',
    to: { name: ROUTE_NAME.ORDERS }
  },
  {
    icon: UserIcon,
    label: 'Usuarios',
    to: { name: ROUTE_NAME.USERS }
  },
  {
    icon: ChatIcon,
    label: 'Mensajes',
    badge: '10',
    to: { name: ROUTE_NAME.MESSAGES }
  },
  {
    icon: SettingIcon,
    label: 'Ajustes'
  }
]

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * goTo
 * @param to
 */
function goTo(to?: RouteLocationRaw) {
  if (to) void $router.push(to)
}
</script>

<template>
  <aside
    :id="elementId"
    class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-6 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full overflow-y-auto bg-white px-3 pb-4 dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li
          v-for="(item, itemKey) in drawerItems"
          :key="`draweri-item-${itemKey}`"
          @click="() => goTo(item.to)"
          :data-drawer-target="elementId"
          :data-drawer-toggle="elementId"
          class="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
          <span class="ml-3 flex-1 whitespace-nowrap">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >{{ item.badge }}</span
          >
        </li>
      </ul>
    </div>
  </aside>
</template>
