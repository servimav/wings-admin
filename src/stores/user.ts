import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type UserLogin,
  type UserAuthResponse,
  type User,
  ROLE_TYPE
} from '@servimav/wings-services'
import { useServices } from '@/services'
import { useStorage } from '@/helpers'

const STORE_NAME = 'user'
const $service = useServices()
const $storage = useStorage<Partial<UserAuthResponse>>(STORE_NAME)

export const useUserStore = defineStore(STORE_NAME, () => {
  const auth_token = ref<string>()
  const user = ref<User>()
  const roles = computed(() => user.value?.roles)

  const isAdmin = computed(() => roles.value?.find((role) => role.name === ROLE_TYPE.ADMIN))
  const isDeveloper = computed(() => roles.value?.find((role) => role.name === ROLE_TYPE.DEVELOPER))
  const isProvider = computed(() =>
    roles.value?.find((role) => role.name === ROLE_TYPE.SHOP_PROVIDER)
  )

  /**
   * -----------------------------------------
   *	Actions
   * -----------------------------------------
   */

  /**
   * geMe
   */
  async function geMe() {
    user.value = (await $service.user.me()).data
  }

  /**
   * login
   * @param params
   */
  async function login(params: UserLogin) {
    const resp = (await $service.user.login(params)).data
    user.value = resp.data
    auth_token.value = resp.auth_token
    saveData()
    return resp
  }

  /**
   * logout
   */
  async function logout() {
    user.value = undefined
    auth_token.value = undefined
    $storage.remove()
  }

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * loadData
   */
  function loadData() {
    const data = $storage.get()
    if (data) {
      user.value = data.data
      auth_token.value = data.auth_token
    }
  }

  /**
   * saveData
   */
  function saveData() {
    $storage.set({
      auth_token: auth_token.value,
      data: user.value
    })
  }

  return {
    auth_token,
    user,
    roles,
    isAdmin,
    isDeveloper,
    isProvider,
    // Actions
    geMe,
    login,
    logout,
    // Methods
    loadData,
    saveData
  }
})

export const _userStorage = $storage
