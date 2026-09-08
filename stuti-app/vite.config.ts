import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

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
      injectRegister: null,   // registered by main.tsx, and only on the web: the native app serves its own files and a precache only made updates arrive a launch late
      // precache only what the shell needs at first paint; every other image is
      // cached the first time it is shown (CacheFirst below), never all at once
      includeAssets: ['icons/*.png', 'assets/kalasha-sm.png', 'assets/nomu-glyph.png', 'assets/parayana-glyph.png', 'stuti-logo*.png'],
      // the designer's own manifest (design_handoff_stuti/app/manifest.webmanifest),
      // with the paths this build serves and the app's own cream (--bg in stuti.css)
      manifest: {
        ...JSON.parse(readFileSync(new URL('../design_handoff_stuti/app/manifest.webmanifest', import.meta.url), 'utf8')),
        id: '/', start_url: '/', scope: '/',
        background_color: '#FAF5EB', theme_color: '#FAF5EB',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
