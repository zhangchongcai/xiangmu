const configUtil = require('./common/utils/config.util')
let config = {
  platform: {
    name: 'hyy'
  },
  plugins: [
    {
      name: '基础平台',
      folder: 'base'
    }
  ],
  sourceType: 'local',
  source: {
    js: [
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: 'vue-awesome-swiper',
      //   externalName: 'VueAwesomeSwiper',
      //   baseSrc: 'assets/external/js/vue-awesome-swiper.js',
      //   cdnSrc: ''
      // },
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: null,
      //   externalName: null,
      //   baseSrc: 'assets/external/swiper/swiper.min.js',
      //   cdnSrc: ''
      // },
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: 'v-charts',
      //   externalName: 'VeIndex',
      //   baseSrc: 'assets/external/v-charts/index.min.js',
      //   cdnSrc: ''
      // }
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: 'echarts',
      //   externalName: 'echarts',
      //   baseSrc: 'assets/external/echarts/map/js/china.js',
      //   cdnSrc: ''
      // },
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: 'sortablejs',
      //   externalName: 'Sortable',
      //   baseSrc: 'assets/external/js/Sortable.min.js',
      //   cdnSrc: ''
      // }
      // {
      //   desc: '资源描述',
      //   version: null,
      //   moduleName: 'crypto-js',
      //   externalName: 'CryptoJS',
      //   baseSrc: 'assets/external/cryptoJs/crypto-js.min.js',
      //   cdnSrc: ''
      // }
    ],
    css: [
      // {
      //   desc: '资源描述',
      //   version: null,
      //   baseSrc: 'assets/external/swiper/swiper.min.css',
      //   cdnSrc: ''
      // }
    ]
  },
  preStage: 1
}

module.exports = {
  getConfig: moduleName => configUtil.getConfig(moduleName, config),
  getExternal: configUtil.getExternal
}
