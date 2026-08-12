import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/* Apka serwowana pod gra.akademiasuperzdrowia.pl/rutyny/ z tego samego repo co gra.
   Build: `pnpm build` -> output trafia do ../rutyny (commitowany; projekt Vercel jest
   czysto statyczny i niczego nie buduje). */
export default defineConfig({
  base: '/rutyny/',
  build: { outDir: '../rutyny', emptyOutDir: true },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['offline.html', 'icons/*.svg', 'icons/*.png', 'fonts/*.ttf'],
    manifest: {
      id: '/rutyny/', name: 'Akademia Super Zdrowia', short_name: 'Zdrowe Rutyny',
      description: 'Codzienny, przyjazny przewodnik po zdrowych rutynach dla dzieci.',
      lang: 'pl', dir: 'ltr', start_url: '/rutyny/', scope: '/rutyny/', display: 'standalone',
      display_override: ['standalone', 'minimal-ui'], orientation: 'any',
      background_color: '#F6F8FB', theme_color: '#14213D',
      categories: ['education', 'health', 'kids'], prefer_related_applications: false,
      icons: [
        { src: '/rutyny/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/rutyny/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/rutyny/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,ico,ttf}'],
      navigateFallback: '/rutyny/index.html',
      cleanupOutdatedCaches: true,
      additionalManifestEntries: Array.from({ length: 10 }, (_, index) => ({
        url: `/rutyny/illustrations/rutyna-${String(index + 1).padStart(2, '0')}.webp`,
        revision: null
      }))
    },
    devOptions: { enabled: true }
  })],
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true }
})
