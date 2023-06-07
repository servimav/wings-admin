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
					component: () => import('@/views/HomeView.vue')
				}
			]
		},
	]
})

export default router

export {
	ROUTE_NAME
}
