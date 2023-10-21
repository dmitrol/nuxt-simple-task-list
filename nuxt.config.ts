// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primeicons/primeicons.css",
  ],
  modules: ["@pinia/nuxt", "nuxt-primevue"],
  build: {
    transpile: ["primevue"],
  },
  primevue: {
    usePrimeVue: true,
    options: {
      ripple: true,
    },
    components: {
      include: [
        "Button",
        "DataTable",
        "Column",
        "Dialog",
        "InputText",
        "Tag",
        "Toast"
      ],
    },
  },
  nitro: {
    plugins: ["@/server/db/index.ts"],
  },
  devtools: { enabled: true },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
  },
});
