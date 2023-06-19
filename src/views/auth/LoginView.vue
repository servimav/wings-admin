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
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Wings
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
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
              class="w-full text-black dark:text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-500 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Iniciar
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
