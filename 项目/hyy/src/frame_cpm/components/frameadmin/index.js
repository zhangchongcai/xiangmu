import Vue from 'vue'

import multiCinema from './cinemaDialog/multiCinema2'
import singleCinema from './cinemaDialog/singleCinema'
import multiFilm from './filmDialog/multiFilm2'
import singleFilm from './filmDialog/singleFilm'
// import ImageUpload from './imageUpload';
// 注意 有些组件使用异步加载会有影响
Vue.component('frame-multifilm', multiFilm)
Vue.component('frame-singlefilm', singleFilm)
Vue.component('frame-multicinema', multiCinema)
Vue.component('frame-singlecinema', singleCinema)
// Vue.use(ImageUpload);
// let moduleName = 'frame';
/**
 * 提供给外部的弹窗，直接在componentObj中注册，切记不能重名
 */
// let componentObj = {
//     multiCinema
// };

// let exportObj = {};
// /**
//  * 将componentObj中存在的项组测成vue可以使用的模式
//  */
// Object.keys(componentObj).forEach(item => {
//     try {
//         let itemName = `${item}`;
//         console.log(itemName);
//         if (!exportObj[itemName]) {
//             exportObj[itemName] = {
//                 install: function() {
//                     // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
//                     vue.component(itemName, componentObj[`${item}`]);
//                 }
//             }
//         } else {
//             new Error(`${moduleName}_${item}已存在！`);
//         }
//     } catch (err) {
//         console.log(new Error(`${moduleName}在构建exportObj时出现错误：${err}`));
//     }
// });
// export default exportObj