// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://beautifysse.com',
    name: 'Beautify Event Stream',
    description: 'The ultimate tool to visualize, debug, and format Server-Sent Events (SSE) and Vercel AI SDK streams.'
  },

  alias: {
    '~/types': './types'
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  hub: {
    db: {
      dialect: 'sqlite',
      driver: process.env.NODE_ENV === 'production' ? 'd1' : undefined,
      connection: {
        databaseId: '6582c564-edef-4146-af80-a76b0c680400'
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    enabled: false
  },

  schemaOrg: {
    enabled: false
  }
})
