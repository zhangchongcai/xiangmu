let config = {
  methods: 'post',
  baseURL: '', //http://localhost:9006/api',//'http://m.tthappy.cn/api', //基础URL前缀
  headers: {
    //请求头信息
    'Content-Type': 'application/json;charset=UTF-8'
  },
  data: {}, //参数
  timeout: 10000, //设置超时时间
  withCredentials: false, //携带凭证
  responseType: 'JSON'
};

let domain = document.domain;
switch (domain) {
  case '192.168.100.222':
    config.baseURL = 'http://192.168.100.222:8082';
    break;
  case '192.168.102.147':
    config.baseURL = 'http://192.168.102.147:8082';
    break;
  case '121.32.27.26':
    config.baseURL = 'http://121.32.27.26:38082';
    break;
  case '127.0.0.1':
  // config.baseURL = 'http://121.32.27.26:38082';
  // config.baseURL = 'http://10.8.10.229:8082';
  // config.baseURL = 'http://192.168.101.95:8084';
  // config.baseURL = 'http://192.168.100.126:8085';
  config.baseURL = 'http://192.168.101.80:8085';
  break;
  default:
  // config.baseURL = 'http://121.32.27.26:38082';

  // config.baseURL = 'http://192.168.101.95:8084'; //销售终端页面主机
  // config.baseURL = 'http://192.168.101.99:8085'; //销售大类页面主机
  // config.baseURL = 'http://192.168.101.88:8085'; //类别管理页面主机
  // config.baseURL = 'http://192.168.100.126:8085'; //单位管理页面主机
  config.baseURL = 'http://192.168.101.79:8086'; //刘名主机
  // config.baseURL = 'http://192.168.101.80:8085'; //销售属性页面主机
}
export default config;