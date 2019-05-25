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
    case '127.0.0.1':
        // config.baseURL = 'http://192.168.100.122:8082';
        // config.baseURL = 'http://192.168.102.223:8030';
        // 北京票券公网ip
        // config.baseURL = 'http://139.129.232.79:8023';
        // config.baseURL = 'http://192.168.100.43:2602';
        // config.baseURL = 'http://172.26.71.223:9704';
        // config.baseURL = 'http://172.26.71.222:2602'
        config.baseURL = 'http://apitest.oristarcloud.com';
        break;
    case '192.168.100.148':
        // 开发环境
        config.baseURL = 'http://192.168.100.43:2602';
        break;
    case '172.26.71.210':
        // 根据端口号判断环境
        let port = location.port;
        switch (port) {
            case '9751':
                // 测试环境
                config.baseURL = 'http://172.26.71.223:9704';
                break;
            case '9750':
                // 开发环境
                config.baseURL = 'http://172.26.71.222:2602';
                break;
        }
        break;
    default:
        // config.baseURL = 'http://39.98.97.116:8083';
        config.baseURL = 'http://apitest.oristarcloud.com';
        break;
}
export default config;