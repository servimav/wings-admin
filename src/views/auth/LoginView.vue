<script setup lang="ts">
import { ref } from 'vue';
import type { UserLogin } from '@servimav/wings-services';
import { useUserStore } from '@/stores/user';

const $user = useUserStore()

const form = ref<UserLogin>({
	email: '',
	password: ''
})

async function onSubmit() {
	await $user.login(form.value)
}
</script>

<template>
	<section class="bg-gray-50 dark:bg-gray-900">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
				<img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
				Wings
			</a>
			<div
				class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
						Inicia con tu cuenta
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
						<div>
							<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
							<input type="email" name="email" id="email" v-model="form.email"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="email@email.com" required>
						</div>
						<div>
							<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
							<input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required>
						</div>
						<div class="flex items-center justify-between">

							<a href="#" class="text-sm font-medium text-primary-500 hover:underline dark:text-primary-500">Olvidaste la
								contraseña?</a>
						</div>
						<button type="submit"
							class="w-full text-black dark:text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-500 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Iniciar</button>

					</form>
				</div>
			</div>
		</div>
	</section>
</template>
