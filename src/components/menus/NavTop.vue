<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { initDrawers } from 'flowbite'
import { ELEMENT_ID } from '@/helpers'
import { useUserStore } from '@/stores'
import { ROUTE_NAME } from '@/router'

const elementId = ELEMENT_ID.DRAWER_LEFT
const $router = useRouter()
const $user = useUserStore()

const user = computed(() => $user.user)

/**
 * logout
 */
function logout() {
  $user.logout()
  $router.push({ name: ROUTE_NAME.AUTH_LOGIN })
}

onMounted(() => {
  initDrawers()
})
</script>

<template>
  <nav
    class="sticky top-0 z-20 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button
            :data-drawer-target="elementId"
            :data-drawer-toggle="elementId"
            :aria-controls="elementId"
            type="button"
            class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              class="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <div class="ml-2 flex md:mr-24">
            <span
              class="self-center whitespace-nowrap text-xl font-semibold text-slate-700 dark:text-white"
              >Wings Admin</span
            >
          </div>
        </div>
        <div class="flex items-center" v-if="user">
          <div class="ml-3 flex items-center">
            <div>
              <button
                type="button"
                class="flex rounded-full text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="/logo.svg" alt="user photo" />
              </button>
            </div>
            <div
              class="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
              id="dropdown-user"
            >
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">{{ user.name }}</p>
                <p
                  class="truncate text-sm font-medium text-gray-900 dark:text-gray-300"
                  role="none"
                >
                  {{ user.email }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <RouterLink
                    :to="{ name: ROUTE_NAME.HOME }"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Inicio</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    :to="{ name: ROUTE_NAME.MESSAGES }"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Ajustes</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    :to="{ name: ROUTE_NAME.MESSAGES }"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Ganancias</RouterLink
                  >
                </li>
                <li>
                  <a
                    href="#"
                    @click="logout"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    >Salir</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
