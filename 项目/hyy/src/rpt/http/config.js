let config = {
    methods: 'post',
    exportExcelURL: '',
    baseURL: '',//http://localhost:9006/api',//'http://m.tthappy.cn/api', //基础URL前缀
    headers: {
        //请求头信息
        'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {}, //参数
    timeout: 10000, //设置超时时间
    withCredentials: false, //携带凭证
    responseType: 'JSON'
};

// let domain = document.domain;
// switch (domain) {
//     case '192.168.100.109': 
//         config.baseURL = 'http://192.168.100.125:8088/';
//         break;
//     default:
//         config.baseURL = 'http://192.168.100.125:8088/';
//         break;
// }



// config.baseURL = 'http://58.67.170.171:8088/';
// config.baseURL = 'http://172.26.71.222:8088';\
// config.baseURL = 'http://apitest.oristarcloud.com/report';
// let domain = document.domain;
// console.log(domain)
// switch (domain) {
//     case "127.0.0.1":
//         config.baseURL = "http://apidev.oristarcloud.com";
//         break;
//     case "dev.oristarcloud.com":
//         config.baseURL = "http://apidev.oristarcloud.com";
//         break;
//     case "test.oristarcloud.com":
//         config.baseURL = "http://apitest.oristarcloud.com";
//         break;
//     default:
//         config.baseURL = "http://apidev.oristarcloud.com";
//         break;
// }

// config.baseURL = "http://apitest.oristarcloud.com";
// config.baseURL = "http://apidev.oristarcloud.com";

export default config;
