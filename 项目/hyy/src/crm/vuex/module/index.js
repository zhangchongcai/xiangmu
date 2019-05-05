//element-ui 上传图片HTTP绑死处理
function baseUploadImg(){
    var imgAction = "";
    switch (document.domain) {
        case "test.oristarcloude.com":
          imgAction =
            "http://apitest.oristarcloud.com/member";
          break;
        default:
          imgAction = "http://apitest.oristarcloud.com/member";
          break;
      }
      return imgAction
}
export default {
    state: {
        imgAction:baseUploadImg()+ '/uploadFile/file',//上传图片地址，动态获取
        domain:baseUploadImg()
    },
    mutations: {
      
    }
};

