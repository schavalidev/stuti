import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Replaces the prototype's hand-written stuti-sw.js. Same intent —
    // the pūjā room is the use case, and it's the one place the wifi is
    // worst — via Workbox instead of a bespoke worker: precache the built
    // app shell, cache-first for the self-hosted fonts and emblem images
    // (content-hashed / never change), network-first for everything else
    // so an edit is never masked by a stale copy.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['emblems/*.png', 'assets/*.png', 'icons/*.png', 'stuti-logo*.png'],
      manifest: {
        name: 'Stuti · स्तुति',
        short_name: 'Stuti',
        description: 'A devotional companion — stotras, pañcāṅga, japa and daily practice.',
        theme_color: '#faf6ee',
        background_color: '#faf6ee',
        display: 'standalone',
        start_url: '/',
        // the kalasha brand mark (public/icons, generated from
        // design_handoff_stuti/app/assets/kalasha.png); the maskable one sits
        // inset on the app's cream so Android's circular crop keeps the leaves
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // the ~1.7MB corpus bundles into a couple of JS chunks
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font' || request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'stuti-static', expiration: { maxEntries: 200 } },
          },
        ],
      },
    }),
  ],
})
