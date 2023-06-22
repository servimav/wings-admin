import { _userStorage, useUserStore } from '@/stores'
import initServimav from '@servimav/wings-services'
import type { TokenHandler } from '@servimav/wings-services'

function tokenHandler(): TokenHandler {
  const handler: TokenHandler = {
    getToken: () => {
      const user = _userStorage.get()
      return user?.auth_token ?? null
    },
    setToken(token: null | string) {
      const storage = _userStorage.get()

      _userStorage.set({
        auth_token: token ?? undefined,
        user: storage && storage.user ? storage.user : undefined
      })
    }
  }

  return handler
}

export function useServices() {
  const services = initServimav({
    apiUrl: import.meta.env.VITE_API_URL,
    tokenHandler: tokenHandler(),
    appSecretKey: import.meta.env.VITE_APP_TOKEN
  })

  services.api.interceptors.response.use(
    (resp) => resp,
    (error) => {
      const $user = useUserStore()
      if (error.response.status === 401) {
        $user.logout()
        window.location.assign('/auth')
      }
      return error
    }
  )

  return services
}
