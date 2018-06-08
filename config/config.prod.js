var path = require('path')

module.exports = {
  env: require('./prod.env'),
  port: 1111,
  apiHost: 'some_host',
  integrationHost: 'some_host',
  cdnUrl: 'some_host',
  cdnUrlPrefix: '/public/en/',
  prefix: '/rest',
  integrationPrefix: '/api',
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  cssSourceMap: true,
  basket: require('./Components/basket').prod,
  products: require('./Components/products').prod,
  currencies: require('./Components/currencies').prod,
  countries: require('./Components/countries').prod,
  checkout: require('./Components/checkout').prod,
  prescriptions: require('./Components/prescriptions').prod,
  wishlist: require('./Components/wishlist').prod,
  orders: require('./Components/orders').prod,
  profiles: require('./Components/profiles').prod,
  users: require('./Components/users').prod,
  menu: require('./Components/menu').prod,
  routes: require('./Components/routes').prod,
  elastic: require('./Components/elastic').prod,
  designers: require('./Components/designers').prod,
  reviews: require('./Components/reviews').prod,
  categories: require('./Components/categories').prod,
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: true,
  productionGzipExtensions: ['js', 'css'],
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,

  // MUST BE DELETED FROM HERE!!!!!!!!!!!!!
  // MUST BE MOVED TO DATABASE!!!!!!!!!!!!!!
  vat: 1.2
}
