import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? './' : '/'
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
