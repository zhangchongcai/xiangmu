//element-ui 上传图片HTTP绑死处理
function baseUploadImg() {
  var imgAction = "";
  switch (document.domain) {
    case "dev.oristarcloude.com":
      imgAction =
        "http://apidev.oristarcloud.com/member";
      break;
    case "test.oristarcloud.com":
      imgAction =
        "http://apitest.oristarcloud.com/member";
      break;
    default:
      imgAction = "http://apidev.oristarcloud.com/member";
      break;
  }
  return imgAction
}
export default {
  state: {
    refillUploadUrl: baseUploadImg() + '/diff/goods/refill',//补加电子优惠券
    fileUploadUrl: baseUploadImg() + '/diff/goods/file',//上传商品券文件
    imgAction: baseUploadImg() + '/uploadFile/file', //上传图片地址，动态获取
    domain: baseUploadImg()
  },
  mutations: {

  }
};