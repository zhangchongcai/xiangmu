// 支付方式
// import payType from 'csm/components/payType/PayType.vue';
// import { payType } from 'csm';
// import cinemaSingle from 'ccmSrc/dialogs/cinema'
import cinemaTreeDialog from 'ccmSrc/dialogs/treeCinema';
import tradeMerchantSingle from 'ccmSrc/dialogs/tradeMerchantSingle';

import payType from '../../components/payType/PayType.vue';

/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件
 */
let alertHandle = {
  components: {
    payType: payType,
    cinemaTreeDialog,
    tradeMerchantSingle
  },
  data () {
    return {
      altertKeysFn: {
        payType: 'payTypeClick',
        cinemaSingle: 'cinemaClick',
        tradeMerchantSingle: 'tradeMerchantSingleClick'
      }
    };
  },
  /**
   * @function beforeCreate - 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
   */
  beforeCreate () {},
  /**
   * @function create - 在实例创建完成后被立即调用
   */
  create () {},
  /**
   * @function beforedMounted 在挂载开始之前被调用：相关的 render 函数首次被调用
   */
  beforedMounted () {},
  /**
   * @function mounted - el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
   */
  mounted () {},
  /**
   * @function beforeUpdate - 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
   */
  beforeUpdate () {},
  /**
   * @function update - 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
   */
  update () {},
  /**
   * @function beforeDestroy - 实例销毁之前调用
   */
  beforeDestroy () {},
  /**
   * @function destroyed - Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
   */
  destroyed () {},
  /**
   * @property {Object} methods - 公用方法库
   */
  methods: {
    /**
     * @function handleMerchant - 交易商户回调处理函数
     */
    handleMerchant (data) {
      console.log(data);
    },
    /**
     * @function cinemaSingleDialog - 交易商户回调处理函数
     */
    cinemaSingleDialog (data) {},
    /**
     * @function cinemaClick - 选择影院点击函数
     */
    cinemaClick (alertCompontsName, keyName) {
      console.log(alertCompontsName, keyName);
      this.$refs[alertCompontsName].openDialog(true, keyName.value);
    },
    /**
     * @function cinemaSingleDialog - 选择影院回调处理函数
     */
    cinemaSingleCallBack (data) {
      // console.log(back.data)
      // let {data} = back
      let currentInputName = this.currentInputName;
      this.baseConfig.form[currentInputName].text = data.text;
      this.baseConfig.form[currentInputName].value = data.id;
    },
    /**
     * @function tradeMerchantSingleClick - 客商名称点击函数
     */
    tradeMerchantSingleClick (alertCompontsName, keyName) {
      this.$refs[alertCompontsName].openDialog(true, keyName.value);
    },
    /**
     * @function tradeMerchantSingleCallBack - 选择客商回调处理函数
     */
    tradeMerchantSingleCallBack (data) {
      let currentInputName = this.currentInputName;
      // this.baseConfig.system.forEach(element => {
      //     if(element[currentInputName] == currentInputName){
      //         element.text = data.data.name
      //         element.value = data.data.id
      //     }
      // });
      this.baseConfig.form[currentInputName].text = data.name;
      this.baseConfig.form[currentInputName].value = data.id;
    }
  }
};

export default alertHandle;
