var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
const url = require('url')
const publicPath = '/'
const CompressionPlugin = require('compression-webpack-plugin') // 开启 gzip 压 缩
const ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin') //静态文件压缩，替换uglify
const HappyPack = require('happypack') //提升构建速度
var os = require('os')
var happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
var CopyWebpackPlugin = require('copy-webpack-plugin')
const env =
  process.env.NODE_ENV === 'production'
    ? require('./env/prod.env')
    : process.env.NODE_ENV === 'test'
    ? require('./env/test.env')
    : require('./env/dev.env')
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;
let routerAlias = {
  ctmRouters: path.resolve('src/frame_cpm/router/empty/'),
  cmmRouters: path.resolve('src/frame_cpm/router/empty/'),
  rptRouters: path.resolve('src/frame_cpm/router/empty/'),
  crmRouters: path.resolve('src/frame_cpm/router/empty/'),
  ccmRouters: path.resolve('src/frame_cpm/router/empty/'),
  camRouters: path.resolve('src/frame_cpm/router/empty/'),
  cimRouters: path.resolve('src/frame_cpm/router/empty/'),
  csmRouters: path.resolve('src/frame_cpm/router/empty/'),
  cwfRouters: path.resolve('src/frame_cpm/router/empty/')
}
if (process.env.NODE_ENV === 'development') {
  if (env.module && env.module.length > 0) {
    env.module.forEach(item => {
      let key = item + 'Routers'
      let pathStr = 'src/' + item + '/router/'
      routerAlias[key] = path.resolve(pathStr)
    })
  } else {
    console.err('初始化错误，请配置开发环境env模块！')
    return
  }
} else {
  routerAlias = {
    ctmRouters: path.resolve('src/ctm/router/'),
    cmmRouters: path.resolve('src/cmm/router/'),
    rptRouters: path.resolve('src/rpt/router/'),
    crmRouters: path.resolve('src/crm/router/'),
    ccmRouters: path.resolve('src/ccm/router/'),
    camRouters: path.resolve('src/cam/router/'),
    cimRouters: path.resolve('src/cim/router/'),
    csmRouters: path.resolve('src/csm/router/'),
    cwfRouters: path.resolve('src/cwf/router/')
  }
}
// console.log(routerAlias);

module.exports = {
  //   entry: './src/main.js',
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: publicPath,
    filename: 'build.[hash].js'
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    axios: 'axios',
    vuex: 'Vuex',
    'vue-awesome-swiper': 'VueAwesomeSwiper',
    sortablejs: 'Sortable'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loaders: [
          'strip-loader?strip[]=console.log,strip[]=console.warn',
          'vue'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'strip-loader?strip[]=console.log,strip[]=console.warn',
          'babel'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: path.resolve('src'),
      ctm: path.resolve('src/ctm'),
      ccm: path.resolve('src/ccm'),
      cmm: path.resolve('src/cmm'),
      rpt: path.resolve('src/rpt'),
      crm: path.resolve('src/crm'),
      cam: path.resolve('src/cam'),
      cim: path.resolve('src/cim'),
      csm: path.resolve('src/csm'),
      cwf: path.resolve('src/cwf'),
      ...routerAlias,
      frame_cpm: path.resolve('src/frame_cpm'),
      jquery: path.resolve('node_modules/jquery/src/jquery')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  resolveLoader: {
    alias: {
      'scss-loader': 'sass-loader'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    contentBase: path.join(__dirname, 'dist'),
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://apidev.oristarcloud.com/',
        changeOrigin: true,
        pathRewrite: {
          // '^/lottery': ''
          '^/api': ''
        }
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'manifest']
    // }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html',
      filename: 'index.html',
      favicon: './favicon.ico'
    }),
    new CopyWebpackPlugin([
      {
        from: 'static',
        to: 'static'
      }
    ]),
    new CleanWebpackPlugin(['dist'])
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'

  module.exports.module.rules = module.exports.module.rules.concat([
    {
      test: /\.js$/,
      // loader: 'babel-loader',
      exclude: /node_modules/,
      loader: 'happypack/loader?id=happy-babel-js',
      include: [path.resolve('src'), path.resolve('test')]
    }
  ])

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
      algorithm: 'gzip', //算法
      test: new RegExp(
        '\\.(js|css)$' //压缩 js 与 css
      ),
      threshold: 1024 * 5, //只处理比这个值大的资源。按字节计算
      minRatio: 0.3 //只有压缩率比这个值小的资源才会被处理
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin('styles.css'),
    new HappyPack({
      id: 'happy-babel-js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    })
    // new BundleAnalyzerPlugin()
  ])
} else {
  module.exports.module.rules = module.exports.module.rules.concat([
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: [path.resolve('src'), path.resolve('test')]
    }
  ])
}
