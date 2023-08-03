<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { User } from '@servimav/wings-services'
import { sendWhatsappMessage } from '@/helpers'

const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckCircle.vue'))
const ExclamationIcon = defineAsyncComponent(
  () => import('@/components/icons/ExclamationCircle.vue')
)
// const PhoneIcon = defineAsyncComponent(() => import('@/components/icons/PhoneOutline.vue'))
const UserIcon = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))
const WhatsappIcon = defineAsyncComponent(() => import('@/components/icons/WhatsApp.vue'))

interface Prop {
  user: User
}

const $props = defineProps<Prop>()

/**
 * contact
 */
function contact() {
  const { name, phone } = $props.user
  sendWhatsappMessage({
    message: `Hola ${name}`,
    phone: phone
  })
}
</script>

<template>
  <div class="flex gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 hover:bg-slate-300">
    <ul class="flex-1 list-none space-y-1">
      <li class="flex items-center gap-2">
        <UserIcon class="h-5 w-5" />
        {{ user.name }}
      </li>
      <li class="flex items-center gap-2">
        <WhatsappIcon @click="contact" class="h-5 w-5 cursor-pointer text-green-600" />
        {{ user.phone }}
      </li>
    </ul>
    <CheckIcon v-if="user.phone_verified_at" class="h-6 w-6 text-green-600" />
    <ExclamationIcon v-else class="h-6 w-6 text-red-600" />
  </div>
</template>
