import ImageUploadVue from './imageUpload.vue';
// 这里是重点
const ImageUpload = {
  install: function (Vue) {
    Vue.component('ImageUpload', ImageUploadVue);
  }
};

// 导出组件
export default ImageUpload;
