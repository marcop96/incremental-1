// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    '@pinia/nuxt',
    "shadcn-nuxt",
    "@nuxt/icon"
  ],

  eslint: {
    config:{
      stylistic: true,
    }
  },

  compatibilityDate: "2024-07-03"
})