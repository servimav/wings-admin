import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ROUTE_NAME } from './names'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
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
    },
    {
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
  ]
})

export default router

export { ROUTE_NAME }
