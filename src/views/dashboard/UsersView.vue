<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import type { User } from '@servimav/wings-services'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */

const UserWidget = defineAsyncComponent(() => import('@/components/widgets/UserWidget.vue'))
/**
 * ------------------------------------------
 *	Composable
 * ------------------------------------------
 */
const $app = useAppStore()
const $service = useServices()
/**
 * ------------------------------------------
 *	data
 * ------------------------------------------
 */

const page = ref<number>()

const scrollHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    getUsers()
  }
}

const users = ref<User[]>([])

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */

/**
 * getUsers
 */
async function getUsers() {
  if ($app.loading) return

  $app.toggleLoading(true)
  try {
    const { data } = await $service.user.list({
      page: page.value ? page.value + 1 : undefined
    })
    page.value = data.meta.current_page
    if (data.data.length) {
      // if is first search overwrite offers
      users.value.push(...data.data)
    } else {
      // Stop event listner
      window.removeEventListener('scroll', scrollHandler)
    }
  } catch (error) {
    $app.axiosError(error)
    window.removeEventListener('scroll', scrollHandler)
  }
  $app.toggleLoading(false)
}

/**
 * ------------------------------------------
 *	Lifecycle
 * ------------------------------------------
 */

onBeforeMount(() => {
  users.value = []
  page.value = undefined
  getUsers()
})

onMounted(() => {
  window.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <section class="p-2">
    <div class="space-y-2">
      <UserWidget v-for="(user, key) in users" :key="`user-${key}-${user.id}`" :user="user" />
    </div>
  </section>
</template>
