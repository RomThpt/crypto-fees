// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  app: {
    head: {
      title: 'CryptoFees.info',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "There's tons of crypto projects. Which ones are people actually paying to use?",
        },
        { property: 'og:title', content: 'CryptoFees.info' },
        {
          property: 'og:description',
          content: "There's tons of crypto projects. Which ones are people actually paying to use?",
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cryptofees.info' },
        { property: 'og:image', content: 'https://cryptofees.info/api/social/top.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@CryptoFeesInfo' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'stylesheet', href: 'https://use.typekit.net/jrq0bbf.css' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@nuxt/image'],

  runtimeConfig: {
    // Server-only environment variables
    mongoUri: process.env.MONGO_URI || '',
    redisUrl: process.env.REDIS_URL || '',
    pgConnectionString: process.env.PG_CONNECTION_STRING || '',
    ethRpc: process.env.ETHEREUM_RPC || '',
    pocketNetwork: process.env.POCKET_NETWORK || '',

    // Public environment variables (exposed to client)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://cryptofees.info',
      gaTrackingId: process.env.NUXT_PUBLIC_GA_TRACKING_ID || 'UA-150445352-3',
      plausibleDomain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN || 'cryptofees.info',
      plausibleApiHost:
        process.env.NUXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://analytics.cryptostats.community',
    },
  },

  // Route rules for caching (ISR-like behavior)
  routeRules: {
    '/': { isr: 1200 }, // 20 minutes revalidation
    '/protocol/**': { isr: 1200 },
    '/history/**': { isr: 3600 }, // 1 hour for historical data
    '/api/v1/**': {
      headers: { 'cache-control': 's-maxage=900, stale-while-revalidate' },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false, // Disable for now during migration - old tsx files cause errors
  },

  // Ignore old Next.js files during migration
  ignore: [
    'pages/**/*.tsx',
    'components/**/*.tsx',
    'utils/api.ts',
  ],

  components: {
    dirs: [
      {
        path: '~/components',
        extensions: ['vue'],
      },
    ],
  },

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // Nitro server configuration
  nitro: {
    preset: 'node-server',
  },

  // Build configuration
  build: {
    transpile: ['vue-chartjs', 'chart.js'],
  },

  // Vite configuration for external packages
  vite: {
    optimizeDeps: {
      include: ['date-fns', 'numeral'],
    },
  },
})
