//element-ui 上传图片HTTP绑死处理
import config from "../../../frame_cpm/http/config"
var baseUploadImg = config.baseURL+"/member"
export default {
  state: {
    refillUploadUrl: baseUploadImg + '/diff/goods/refill', //补加电子优惠券
    fileUploadUrl: baseUploadImg + '/diff/goods/file', //上传商品券文件
    imgAction: baseUploadImg + '/uploadFile/file', //上传图片地址，动态获取
    domain: baseUploadImg
  },
  mutations: {

  }
};