export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ListEat',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  target: 'static',
  ssr: true,
  loading: '~/components/loading.vue',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'node_modules/modern-normalize/modern-normalize.css',
    '~assets/style/main.styl'
  ],

  cssSourceMap: true,
  extractCSS: true,

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/lottie-player.js', mode: 'client' },
    { ssr: false, src: '~plugins/datepicker.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  router: {
    middleware: [
      'authenticated'
    ]
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    ['nuxt-lazy-load', {
      directiveOnly: true
    }]
  ],

  env: {
    baseUrl: process.env.baseUrl || 'http://localhost:3000',
    serverUrl: process.env.serverUrl || 'http://localhost:8080'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

  },

  // Extra style resources that are available anywhere in the project folder. Requires @nuxtjs/style-resources in modules
  styleResources: {
    stylus: [
      '~assets/styleResources/_variables.styl',
      '~assets/styleResources/_mixins.styl'
    ]
  },

  axios: {
    baseUrl: process.env.baseUrl,
    // proxy: true
  },

  proxy: {
    // '/api1': {
    //   target: 'http://localhost:8080',
    //   pathRewrite: {'^/api1': ''},
    //   changeOrigin: true
    // }
  }
}
