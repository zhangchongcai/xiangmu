import vue from 'vue';
import SaleList from './saleList/index.vue';

/**
 * @description 此文件用于将子项目中需要提供给外部项目引用的弹窗组件注册，每个子项目alert文件夹中必须有这个文件
 * @param {String} moduleName - 用于向外提供项目组名字
 */
let moduleName = 'ccm';

/**
 * 提供给外部的弹窗，直接在componentObj中注册，切记不能重名
 */
let componentObj = {
    SaleList
};

let exportObj = {};
/**
 * 将componentObj中存在的项组测成vue可以使用的模式
 */
Object.keys(componentObj).forEach(item => {
    try {
        let itemName = `${moduleName}${item}`;
        console.log(itemName);
        if (!exportObj[itemName]) {
            exportObj[itemName] = {
                install: function() {
                    // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
                    vue.component(itemName, componentObj[`${item}`]);
                }
            }
        } else {
            new Error(`${moduleName}_${item}已存在！`);
        }
    } catch (err) {
        console.log(new Error(`${moduleName}在构建exportObj时出现错误：${err}`));
    }
});

export default exportObj;