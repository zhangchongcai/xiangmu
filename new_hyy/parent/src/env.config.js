const configUtil = require('./common/utils/config.util.js')
let env = {
  platform: {
    name: 'hyy'
  },
  // getBaseUrl: configUtil.getBaseUrl
  baseUrlMapper: [
    {
      domain: '127.0.0.1',
      baseURL: '//apidev.oristarcloud.com'
    },
    {
      domain: 'localhost',
      baseURL: '//apidev.oristarcloud.com'
    },
    {
      domain: 'dev.oristarcloud.com',
      baseURL: '//apidev.oristarcloud.com'
    },
    {
      domain: 'www.oristarcloud.com',
      baseURL: '//api.oristarcloud.com'
    },
    {
      domain: 'test.oristarcloud.com',
      baseURL: '//apitest.oristarcloud.com'
    },
    {
      domain: 'devzynf.oristarcloud.com',
      baseURL: '//apidevzynf.oristarcloud.com'
    },
    {
      domain: 'testzynf.oristarcloud.com',
      baseURL: '//apitestzynf.oristarcloud.com'
    },
    {
      domain: 'pre.oristarcloud.com',
      baseURL: '//apipre.oristarcloud.com'
    }
  ]
}

module.exports = {
  getEnv: moduleName => configUtil.getEnv(moduleName, env)
}
