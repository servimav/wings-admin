import { useUserStore } from '@/stores'
import type { NavigationGuard } from 'vue-router'
import { ROUTE_NAME } from '.'

export const authGuard: NavigationGuard = (to, from, $next) => {
  const $user = useUserStore()

  if ($user.auth_token) {
    $next()
  } else {
    $next({
      name: ROUTE_NAME.AUTH_LOGIN
    })
  }
}
