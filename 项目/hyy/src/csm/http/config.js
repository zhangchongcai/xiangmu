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
       // 黎康
    case '192.168.100.124':
    //    config.baseURL = 'http://192.168.100.118:2302';
    //    config.baseURL = 'https://apitestpos.oristarcloud.com'
            config.baseURL = 'https://apidevpos.oristarcloud.com'
       // config.baseURL = 'http://192.168.100.25:8084'
       break
    case '127.0.0.1':
        // config.baseURL = "http://192.168.100.38:8082";
        // config.baseURL = 'http://localhost:9006';
        // config.baseURL = 'http://127.0.0.1:9006/';
        // config.baseURL = 'http://192.168.100.124:8082';
        //測試環境
        // config.baseURL = 'http://192.168.102.147:8082'
        // 吴小江
        // config.baseURL = 'http://192.168.100.118:2302';
        
        // config.baseURL = 'http://192.168.100.25:8084'
        // config.baseURL = 'http://121.32.27.26:38084';
        // config.baseURL = 'http://10.8.11.9:8084';
        // config.baseURL = 'http://10.8.0.18:8084';
        // config.baseURL = 'http://192.168.100.23:2301'
        // config.baseURL = 'https://apitestpos.oristarcloud.com'
        // config.baseURL = 'http:192.168.100.23:2301'  //胡恩
        // config.baseURL = 'http://172.16.1.110:2302';
        // config.baseURL = 'http://10.8.0.18:2302';
        config.baseURL = 'https://apidevpos.oristarcloud.com'
        break;
    case "dev.oristarcloud.com":
        // config.baseURL = "http://apidev.oristarcloud.com";
        config.baseURL = 'https://apidevpos.oristarcloud.com'

        break;
    case "test.oristarcloud.com":
        // config.baseURL = "http://apitest.oristarcloud.com";
        config.baseURL = 'https://apitestpos.oristarcloud.com'

        break;
    default:
        // config.baseURL = 'http://121.32.27.26:38084';
        config.baseURL = "http://apidev.oristarcloud.com";
}
export default config;