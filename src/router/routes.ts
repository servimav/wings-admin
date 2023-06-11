import type { RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards'
import { ROUTE_NAME } from './names'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

/**
 * authRoutes
 */
const authRoutes: RouteRecordRaw = {
  path: '/auth',
  component: () => import('@/layouts/AuthLayout.vue'),
  children: [
    {
      path: '',
      name: ROUTE_NAME.AUTH_LOGIN,
      component: () => import('@/views/auth/LoginView.vue')
    }
  ]
}

/**
 * dashboardRoutes
 */
const dashboardRoutes: RouteRecordRaw = {
  path: '/',
  component: DashboardLayout,
  beforeEnter: authGuard,
  children: [
    {
      path: '',
      name: ROUTE_NAME.HOME,
      component: () => import('@/views/dashboard/HomeView.vue')
    },
    {
      path: 'messages',
      name: ROUTE_NAME.MESSAGES,
      component: () => import('@/views/dashboard/MessagesView.vue')
    },
    {
      path: 'offers',
      name: ROUTE_NAME.OFFERS,
      component: () => import('@/views/dashboard/OffersView.vue')
    },
    {
      path: 'orders',
      name: ROUTE_NAME.ORDERS,
      component: () => import('@/views/dashboard/OrdersView.vue')
    },
    {
      path: 'store',
      name: ROUTE_NAME.STORE,
      component: () => import('@/views/dashboard/StoreView.vue')
    }
  ]
}

const routes: RouteRecordRaw[] = [dashboardRoutes, authRoutes]

export default routes
