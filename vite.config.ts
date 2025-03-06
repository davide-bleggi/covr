import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
			manifest: {
				name: 'Covr',
				short_name: 'Covr',
				start_url: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/icons/icon-192x192.webp',
						sizes: '192x192',
						type: 'image/webp'
					},
					{
						src: '/icons/icon-512x512.webp',
						sizes: '512x512',
						type: 'image/webp'
					}
				]
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.destination === 'image',
						handler: 'CacheFirst',
						options: {
							cacheName: 'images-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
							}
						}
					},
					{
						urlPattern: ({ request }) => request.destination === 'document',
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 24 * 60 * 60 // 1 day
							}
						}
					}
				]
			}
		})
	]
});
