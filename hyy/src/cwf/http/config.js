let config = {
    methods: 'post',
    baseURL: '', //http://localhost:9006/api',//'http://m.tthappy.cn/api', //基础URL前缀
    headers: {
        //请求头信息
        'Content-Type': 'application/json;charset=UTF-8',
    },
    data: {}, //参数
    timeout: 10000, //设置超时时间
    withCredentials: false, //携带凭证
    responseType: 'JSON',
};

let domain = document.domain;
console.log(domain)
switch (domain) {
    case '127.0.0.1':
        config.baseURL = 'http://apidev.oristarcloud.com';

        break;
    case '172.26.71.210':
        let port = location.port;
        switch (port) {
            case '9753':
                // 测试环境
                config.baseURL = 'http://172.26.71.223:9701';
                break;
            case '9752':
                // 开发环境
                config.baseURL = 'http://172.26.71.222:2901';
                break;
        }
        break;
    default:
        config.baseURL = 'http://apidev.oristarcloud.com';
        break;
}
export default config;