<script setup lang="ts">
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { ELEMENT_ID } from '@/helpers'
import { defineAsyncComponent } from 'vue'
// Components
const ChartBarIcon = defineAsyncComponent(() => import('@/components/icons/ChartBarIcon.vue'))
const ChatIcon = defineAsyncComponent(() => import('@/components/icons/ChatIcon.vue'))
const HomeIcon = defineAsyncComponent(() => import('@/components/icons/HomeIcon.vue'))
const OfferIcon = defineAsyncComponent(() => import('@/components/icons/OfferIcon.vue'))
const SettingIcon = defineAsyncComponent(() => import('@/components/icons/SettingIcon.vue'))
const SquaresIcon = defineAsyncComponent(() => import('@/components/icons/SquaresIcon.vue'))
const StoreIcon = defineAsyncComponent(() => import('@/components/icons/StoreIcon.vue'))

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
    label: 'Inicio'
  },
  {
    icon: SquaresIcon,
    label: 'Pedidos',
    badge: '5'
  },
  {
    icon: StoreIcon,
    label: 'Mi Tienda'
  },
  {
    icon: OfferIcon,
    label: 'Mis Productos'
  },
  {
    icon: ChatIcon,
    label: 'Mensajes',
    badge: '10'
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
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li
          v-for="(item, itemKey) in drawerItems"
          :key="`draweri-item-${itemKey}`"
          @click="() => goTo(item.to)"
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <component :is="item.icon" class="w-6 h-6 flex-shrink-0" />
          <span class="flex-1 ml-3 whitespace-nowrap">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
            >{{ item.badge }}</span
          >
        </li>
      </ul>
    </div>
  </aside>
</template>
