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
            config.baseURL = 'http://apidevpos.oristarcloud.com'
       // config.baseURL = 'http://192.168.100.25:8084'
       break
    case '127.0.0.1':
        // config.baseURL = 'http://192.168.100.118:2302';  // 吴小江
        //config.baseURL = 'http://apitestpos.oristarcloud.com'  //test  
        //config.baseURL = 'http://apitest.oristarcloud.com/trade/'
        config.baseURL = 'https://api.oristarcloud.com/trade/'
        //config.baseURL = 'http://apidevpos.oristarcloud.com'
        break;
    case "dev.oristarcloud.com":
        // config.baseURL = "http://apidev.oristarcloud.com";
        config.baseURL = 'http://apidevpos.oristarcloud.com'

        break;
    case "test.oristarcloud.com":
        // config.baseURL = "http://apitest.oristarcloud.com";
        config.baseURL = 'http://apitestpos.oristarcloud.com'

        break;
    case "www.oristarcloud.com":
        config.baseURL = 'https://apipos.oristarcloud.com'
        break;
    default:
        // config.baseURL = 'http://121.32.27.26:38084';
        config.baseURL = "https://apipos.oristarcloud.com";
}
export default config;