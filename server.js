//express server
const express = require('express')
const server = express()
const fs = require('fs')
const path = require('path')
var config = require('./config')

const PORT = 8081// process.env.PORT || config.port
const HOST = process.env.HOST || 'localhost'
const {JSDOM} = require('jsdom')

function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}
require('jsdom-global')()

const dom = new JSDOM('<!doctype html><html><head><script></script></head><body></body></html>', {url: `http://${HOST}:${PORT}`})
const win = dom.defaultView
global.window = dom.window
global.document = window.document
global.navigator = window.navigator

global.localStorage = window.localStorage = window.sessionStorage = {
  getItem: function (key) {
    const value = this[key]
    return typeof value === 'undefined' ? null : value
  },
  setItem: function (key, value) {
    this[key] = value
  },
  removeItem: function (key) {
    return delete this[key]
  }
}

global.XMLHttpRequest = require('xhr2')
global.URL = require('url').URL

propagateToGlobal(win)

//obtain bundle
const bundle = require('./dist/server.bundle.js')
//get renderer from vue server renderer
const renderer = require('vue-server-renderer').createRenderer({
  //set template
  template: fs.readFileSync('./index.html', 'utf-8')
})

var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
server.use(staticPath, express.static('./static'))
server.use('/dist', express.static(path.join(__dirname, './dist')))

//start server
server.get('*', (req, res) => {

  bundle.default({url: req.url}).then((app) => {
    //context to use as data source
    //in the template for interpolation
    const context = {
      globals: {
        __INITIAL_STATE__: app.$store.state
      }
    }

    renderer.renderToString(app, context, function (err, html) {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
      } else {
        res.end(html)
      }
    })
  }, (err) => {
    console.log(err)
  })
})

server.listen(PORT)
console.log('> Starting dev server...')
