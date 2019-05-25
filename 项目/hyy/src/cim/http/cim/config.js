var cimRegion = "/cim";
let config = {
    baseURL: "",
    basePosURL: ""
}
let domain = document.domain;

switch (domain) {
	case "127.0.0.1":
        // config.baseURL =  "http://apidev.oristarcloud.com"+cimRegion;
        // config.basePosURL = "http://apidevpos.oristarcloud.com";
        config.baseURL = "http://apitest.oristarcloud.com" + cimRegion;
        config.basePosURL = "http://apitestpos.oristarcloud.com";
        // config.baseURL = 'http://192.168.100.126:8085/'; //彭江华（供应商）
        // config.baseURL = 'http://192.168.101.79:8085/'; //刘名（合成品）
        // config.baseURL = 'http://192.168.101.91:8085/'; //黄传举(总部套餐)
        // config.baseURL = 'http://192.168.101.99:8085/'; //辛伯胤(服务商品)
        // config.baseURL = 'http://192.168.101.98:8085'+cimRegion; //杜祥超(门店单品)
        // config.baseURL = 'http://192.168.101.95:8085/'; //宋文俊(总部单品)
        // config.baseURL = 'http://192.168.101.80:8085'+cimRegion; //杨洋(门店套餐)
        break;
    case "dev.oristarcloud.com":
        config.baseURL = "http://apidev.oristarcloud.com" + cimRegion;
        config.basePosURL = "http://apidevpos.oristarcloud.com";
        break;
    case "test.oristarcloud.com":
        config.baseURL = "http://apitest.oristarcloud.com" + cimRegion;
        config.basePosURL = "http://apitestpos.oristarcloud.com";
        break;
}
export default config;
