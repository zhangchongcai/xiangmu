/**
 * Created by zhanchenlong on 2019/8/14.
 */
const state = {
  env: {},
  apiConfig: {
    methods: 'post',
    baseURL: '', // http://localhost:9006/api',//'http://m.tthappy.cn/api', //基础URL前缀
    headers: {
      // 请求头信息
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {}, // 参数
    timeout: 10000, // 设置超时时间
    withCredentials: true, // 携带凭证
    responseType: 'JSON'
  }
};
const mutations = {
  updateProcessEnv (state, payload) {
    let domain = document.domain,
      protocol = window.location.protocol;
    let config = state.apiConfig;
    // console.log('config');
    let baseUrlMapper = payload.baseUrlMapper;
    if (baseUrlMapper && baseUrlMapper.length > 0) {
      let urlMapper = baseUrlMapper.find(item => {
        return item.domain === domain;
      });
      config.baseURL = protocol + urlMapper.baseURL;
      // console.log(config);
    }
    state.env = payload;
    state.apiConfig = config;
  },
  updateBaseURL (state, payload) {
    let config = state.apiConfig;
    config.baseURL = payload;
    state.config = config;
  }
};
const actions = {};

export default {
  state,
  actions,
  mutations
};
