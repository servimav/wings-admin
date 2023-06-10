/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/flowbite/**/*.js"
	],
	theme: {
		extend: {
			colors: {
				'primary': '#FB8500',
				'primary-100': '#FFCC5A',
				'primary-300': '#FB8500',
				'primary-500': '#D06200',
				'primary-700': '#A54000',
				'primary-900': '#7E1C00',
			}
		},
	},
	plugins: [
		require('flowbite/plugin')
	],
}

