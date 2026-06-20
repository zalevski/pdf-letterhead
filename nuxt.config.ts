import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  ui: {
    fonts: false
  },
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: './'
  },
  nitro: {
    preset: 'static'
  },
  typescript: {
    strict: true,
    shim: false
  },
  compatibilityDate: '2025-06-20'
} as any)
