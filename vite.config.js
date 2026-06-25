import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@react-pdf/renderer'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-pdf': ['@react-pdf/renderer'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,gif}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: 'Imperious Fitness',
        short_name: 'Imperious Fitness',
        description: 'Seu app de academia personalizado',
        theme_color: '#0056D2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
