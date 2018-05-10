var path = require('path')
var webpack = require('webpack')
var config = require('./config')
var CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

function assetsPath (_path) {
  var assetsSubDirectory = config.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
              'extractCSS': true
            }
          }
        ]
      },
      {
        test: /\.postcss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, sourceMap: true, 'extractCSS': true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader', {
            loader: 'css-loader',
            options: {minimize: true, sourceMap: true, 'extractCSS': true}
          },
          {
            loader: 'less-loader', options: {sourceMap: true}
          }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {minimize: true, sourceMap: true, 'extractCSS': true}
          },
          {
            loader: 'sass-loader', options: {'indentedSyntax': true, sourceMap: true}
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {minimize: true, sourceMap: true, 'extractCSS': true}
          },
          {
            loader: 'sass-loader', options: {sourceMap: true}
          }
        ]
      },
      {
        test: /\.stylus$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, sourceMap: true, 'extractCSS': true
            }
          },
          {
            loader: 'stylus-loader', options: {sourceMap: true}
          }
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'vue-style-loader', {
            loader: 'css-loader',
            options: {minimize: true, sourceMap: true, 'extractCSS': true}
          },
          {
            loader: 'stylus-loader', options: {sourceMap: true}
          }
        ]
      },
      /* {
       test: /\.(js|vue)$/,
       loader: 'eslint-loader',
       enforce: 'pre',
       include: [resolve('src'), resolve(test)],
       options: {
       formatter: require('eslint-friendly-formatter')
       }
       }, */
      {
        test: /\.js$/,
        exclude: ['node_modules'],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {minimize: true, sourceMap: true, 'extractCSS': true}
              },
              {
                loader: 'sass-loader', options: {sourceMap: true}
              }
            ],
            'sass': [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {minimize: true, sourceMap: true, 'extractCSS': true}
              },
              {
                loader: 'sass-loader', options: {'indentedSyntax': true, sourceMap: true}
              }
            ],
            'css': ['vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: true,
                  'extractCSS': true
                }
              }
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      'Popper.js': ['popper.js', 'default'],
      'Popper': ['popper.js', 'default'],
      'window.Popper': ['popper.js', 'default'],
      'window.Promise': 'promise'
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: config.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
