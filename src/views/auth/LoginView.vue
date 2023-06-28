<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { UserLogin } from '@servimav/wings-services'
import { useAppStore, useUserStore } from '@/stores'
import { ROUTE_NAME } from '@/router'
// Components
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
/**
 * -----------------------------------------
 *	Helpers
 * -----------------------------------------
 */

const $app = useAppStore()
const $router = useRouter()
const $user = useUserStore()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */

const form = ref<UserLogin>({
  phone: '',
  password: ''
})

const user = computed(() => $user.user)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * onSubmit
 */
async function onSubmit() {
  try {
    await $user.login(form.value)
    $app.success(`Bienvenido ${user.value?.name}`)
    $router.push({ name: ROUTE_NAME.HOME })
  } catch (error) {
    $app.axiosError(error, 'Credenciales incorrectas')
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <a
        href="#"
        class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img class="mr-2 h-20 w-20" src="/logo.svg" alt="Wings" />
        Wings Deliver
      </a>
      <div
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            Inicia con tu cuenta
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
            <TextInput
              v-model="form.phone"
              type="tel"
              id="login-tel"
              class="my-2"
              label="Teléfono"
              placeholder="Número de teléfono"
              required
            />
            <TextInput
              v-model="form.password"
              type="password"
              id="login-password"
              class="my-2"
              label="Contraseña"
              placeholder="********"
              required
            />

            <div class="flex items-center justify-between">
              <a
                href="#"
                class="text-sm font-medium text-primary-500 hover:underline dark:text-primary-500"
                >Olvidaste la contraseña?</a
              >
            </div>
            <button
              type="submit"
              class="dark:focus:ring-primary-800 w-full rounded-lg bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-black hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-700"
            >
              Iniciar
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
