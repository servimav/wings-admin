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
      path: 'cat',
      name: ROUTE_NAME.CATEGORIES,
      component: () => import('@/views/dashboard/CategoriesView.vue')
    },
    {
      path: 'messages',
      name: ROUTE_NAME.MESSAGES,
      component: () => import('@/views/dashboard/MessagesView.vue')
    },
    {
      path: 'orders',
      name: ROUTE_NAME.ORDERS,
      component: () => import('@/views/dashboard/OrdersView.vue')
    },
    {
      path: 'orders/:orderId',
      name: ROUTE_NAME.ORDER,
      component: () => import('@/views/dashboard/OrderView.vue')
    },
    {
      path: 'offers',
      name: ROUTE_NAME.OFFERS,
      component: () => import('@/views/dashboard/OffersView.vue')
    },
    {
      path: 'offers/:offerId',
      name: ROUTE_NAME.OFFER,
      component: () => import('@/views/dashboard/OfferView.vue')
    },
    {
      path: 'stores',
      name: ROUTE_NAME.STORES,
      component: () => import('@/views/dashboard/StoresView.vue')
    },
    {
      path: 'stores/:storeId',
      name: ROUTE_NAME.STORE,
      component: () => import('@/views/dashboard/StoreView.vue')
    },
    {
      path: 'stores/:storeId/offers',
      name: ROUTE_NAME.STORE_OFFERS,
      component: () => import('@/views/dashboard/OffersView.vue')
    },
    {
      path: 'stores/:storeId/orders',
      name: ROUTE_NAME.STORE_ORDERS,
      component: () => import('@/views/dashboard/OrdersView.vue')
    },
    {
      path: 'users',
      name: ROUTE_NAME.USERS,
      component: () => import('@/views/dashboard/UsersView.vue')
    },
    {
      path: 'stores/:storeId',
      name: ROUTE_NAME.STORE,
      component: () => import('@/views/dashboard/StoreView.vue')
    }
  ]
}

const routes: RouteRecordRaw[] = [dashboardRoutes, authRoutes]

export default routes
