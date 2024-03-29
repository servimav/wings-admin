<script setup lang="ts">
import type { ShopOffer, ShopStore } from '@servimav/wings-services'
import { computed } from 'vue'

export interface Emits {
  (e: 'delete'): void
}

export interface Props {
  id: string
  offer?: ShopOffer
  store?: ShopStore
}
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */

const $emits = defineEmits<Emits>()
const $props = defineProps<Props>()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const title = computed(() => {
  if ($props.offer) return 'Eliminar Oferta'
  if ($props.store) return 'Eliminar Tienda'
  return 'Eliminar'
})

const description = computed<string[]>(() => {
  let name: string = ''
  if ($props.offer) name = $props.offer.name
  if ($props.store) name = $props.store.name

  return [
    `¿Está seguro que desea eliminar ${name}?`,
    `Tenga presente que esta acción es irreversible y puede perder los datos asociados a ${name}`
  ]
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

function confirmDelete(event: Event) {
  event.preventDefault()
  $emits('delete')
}
</script>

<template>
  <!-- Main modal -->
  <div
    :id="id"
    tabindex="-1"
    aria-hidden="true"
    class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
  >
    <div class="relative max-h-full w-full max-w-2xl">
      <!-- Modal content -->
      <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
          <button
            type="button"
            class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            :data-modal-hide="id"
          >
            <svg
              aria-hidden="true"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="space-y-6 p-6">
          <p
            class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            v-for="(desc, dKey) in description"
            :key="`desc-p-${dKey}`"
          >
            {{ desc }}
          </p>
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600"
        >
          <button
            :data-modal-hide="id"
            type="button"
            class="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            @click="confirmDelete"
          >
            Eliminar
          </button>
          <button
            :data-modal-hide="id"
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
