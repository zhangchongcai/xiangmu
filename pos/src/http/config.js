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
console.log(domain)

switch (domain) {
    case '192.168.100.222':
        config.baseURL = 'http://192.168.100.122:8082';
        break;
    case '192.168.102.147':
        config.baseURL = 'http://192.168.102.147:8082';
        break;
    case '192.168.100.148':
        // 曾宇发
        config.baseURL = 'http://192.168.100.124:8082';
        break;
    case '192.168.1.86':
        // 刘念
        config.baseURL = 'http://172.26.71.226:3502';
        // config.baseURL = "http://172.26.71.213:3502"; //test
        break;
    case '127.0.0.1':
        // config.baseURL = "http://192.168.100.38:8082";
        // member本地测试
        // config.baseURL = "http://172.26.71.226:3502";
        config.baseURL = "http://apidev.oristarcloud.com";
        // config.baseURL = "http://172.26.71.213:9001"; //test
        // config.baseURL = 'http://121.32.27.26:38082';
        // config.baseURL = 'http://127.0.0.1:9006/';
        // config.baseURL = 'http://192.168.100.124:8082';
        //測試環境
        // config.baseURL = 'http://192.168.102.147:8082'
        break;
    case '172.26.71.210':
        config.baseURL = "http://172.26.71.226:9001"
        break;
    case 'testpos.oristarcloud.com':
        config.baseURL = "http://172.26.71.213:3502"
        break;
    default:
        // config.baseURL = 'http://127.0.0.1:9006/';
        config.baseURL = 'http://192.168.100.38:8082';
        // config.baseURL = 'http://192.168.100.122:8082';
        // config.baseURL = 'http://192.168.100.23:8082';
}
export default config;
