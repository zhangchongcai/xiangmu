let config = {
    methods: 'post',
    baseURL: 'http://192.168.1.177:8080/', //http://localhost:9006/api',//'http://m.tthappy.cn/api', //基础URL前缀
    // http://192.168.1.177:8080/home/initBoxOffice
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
    case '':
        break;
    default:
        // config.baseURL = 'http://dev.api.tthappy.cn/api';
        config.baseURL = 'http://apitest.oristarcloud.com/analysis'
        break;
}
export default config;  