module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Logistic Pro Demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#fffa20' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'lodash/debounce'],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  // Global Page CSS (
  css: ['assets/css/main.scss'],

  // Plugins
  plugins: ['plugins/element-ui.js']
}
