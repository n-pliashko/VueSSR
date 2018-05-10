var config = {}
let env = process.env.NODE_ENV

if(
  !process.env.NODE_ENV ||
  (process.env.NODE_ENV).toString().toLowerCase() === 'production' ||
  (process.env.NODE_ENV).toString().toLowerCase() === 'live'
) {
  config = require('./config.prod')
} else if(
  (process.env.NODE_ENV).toString().toLowerCase() === 'dev' ||
  (process.env.NODE_ENV).toString().toLowerCase() === 'development'
) {
  config = require('./config.dev')
} else if(
  (process.env.NODE_ENV).toString().toLowerCase() === 'test' ||
  (process.env.NODE_ENV).toString().toLowerCase() === 'testing'
) {
  config = require('./config.test')
} else if (!process) {
  config = require('./config.local')
} else {
  config = require('./config.' + (env.toString().toLowerCase()))
}

module.exports = config
