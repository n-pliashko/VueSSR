var path = require('path')

module.exports = {
  env: require('./test.env'),
  port: 1111,
  apiHost: 'https://yii.omnismain.com',
  integrationHost: 'https://ss-brahmin.omnismain.com',
  cdnUrl: 'https://d9qzjwuieyamt.cloudfront.net',
  cdnUrlPrefix: '/public/en/',
  prefix: '/rest',
  integrationPrefix: '/api',
  autoOpenBrowser: true,
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  proxyTable: {},
  basket: require('./Components/basket').dev,
  products: require('./Components/products').dev,
  currencies: require('./Components/currencies').dev,
  countries: require('./Components/countries').prod,
  checkout: require('./Components/checkout').dev,
  prescriptions: require('./Components/prescriptions').dev,
  wishlist: require('./Components/wishlist').dev,
  orders: require('./Components/orders').dev,
  profiles: require('./Components/profiles').dev,
  users: require('./Components/users').dev,
  menu: require('./Components/menu').dev,
  routes: require('./Components/routes').dev,
  elastic: {
    host: 'yii.omnismain.com',
    protocol: 'https',
    port: 443,
    index: 'ssyii',
    type: 'items'
  },
  designers: require('./Components/designers').dev,
  reviews: require('./Components/reviews').dev,
  categories: require('./Components/categories').dev,
  // CSS Sourcemaps off by default because relative paths are "buggy"
  // with this option, according to the CSS-Loader README
  // (https://github.com/webpack/css-loader#sourcemaps)
  // In our experience, they generally work as expected,
  // just be aware of this issue when enabling this option.
  cssSourceMap: false,
  vat: 1.2
}
