import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'

import { VitePWA } from "vite-plugin-pwa"
import viteCompression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		viteCompression(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: ["img/*.png", "img/*.svg", "icons/*.svg"],
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				cleanupOutdatedCaches: false,
				sourcemap: true,
			},
			devOptions: {
				enabled: false,
			},
			manifest: {
				name: "Wings Admin",
				short_name: "Wings Admin",
				description: "",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				lang: "es",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png"
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						"type": "image/png"
					}, {
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				],
			},
		}),
	],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@servimav': fileURLToPath(new URL('./@servimav', import.meta.url))
		}
	}
})
