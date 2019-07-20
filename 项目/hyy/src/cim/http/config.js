import frame_cpm_config from 'frame_cpm/http/config';
var cimRegion = "/cim";
// var cimRegion = "";

let config = {
    baseURL: frame_cpm_config.baseURL + cimRegion,
    basePosURL: ""
}
// let domain = document.domain;
//
// switch (domain) {
//     case "127.0.0.1":
//         // config.baseURL =  "http://apidev.oristarcloud.com"+cimRegion;
//         // config.basePosURL = "http://apidevpos.oristarcloud.com";
//
//         config.baseURL = frame_cpm_config.baseURL + cimRegion;
//         config.basePosURL = "http://apitestpos.oristarcloud.com";
//
//         // config.basePosURL = "http://apitestpos.oristarcloud.com";
//         // config.baseURL = 'http://192.168.100.126:8085'; //彭江华（供应商）
//         // config.baseURL = 'http://192.168.101.98:8085'; //杜祥超(门店单品)
//         // config.baseURL = 'http://192.168.101.95:8085'; //宋文俊(总部单品)
//         // config.baseURL = 'http://192.168.101.80:8085'; //杨洋(门店套餐)
//         // config.baseURL = 'http://192.168.100.132:8085'; //黄武雄(入库和退货单)
//         // config.baseURL = 'http://192.168.101.79:8085'; //刘名（合成品）
//         // config.baseURL = 'http://192.168.101.91:8085'; //黄传举(总部套餐)
//         // config.baseURL = 'http://192.168.101.99:8085'; //辛伯胤(服务商品)
//         break;
//     case "dev.oristarcloud.com":
//         config.baseURL = "http://apidev.oristarcloud.com" + cimRegion;
//         config.basePosURL = "http://apidevpos.oristarcloud.com";
//         break;
//     case "test.oristarcloud.com":
//         config.baseURL = "http://apitest.oristarcloud.com" + cimRegion;
//         config.basePosURL = "http://apitestpos.oristarcloud.com";
//         break;
//     default:
//         let test =`${location.host}`
//         config.baseURL = `${location.protocol}//api`+test.replace(/www/g,'')+ cimRegion;
//         break;
// }
export default config;
