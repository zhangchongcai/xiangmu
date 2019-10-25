import cinemaTreeDialog from 'ccmSrc/dialogs/treeCinema'; // 影院包含组织节点弹窗
import cinemaSingleDialog from 'ccmSrc/dialogs/cinema'; // 影院单选

import tradeMerchantSingleDialog from 'ccmSrc/dialogs/tradeMerchantSingle'; // 交易客商

import selectedBrandSingle from 'ccmSrc/dialogs/selectedBrandSingle'; // 品牌弹窗
import selectedGoodsSingle from 'ccmSrc/dialogs/selectedGoodsSingle'; // 选择商品
import merClassSingle from 'ccmSrc/dialogs/merClassSingle'; // 选择类别

import findStartNum from 'ccmSrc/dialogs/findStartNum';

// import cinemaMultipDialog from 'cmm/dialogs/cinema/cinemaDialog'; // 影院弹窗 多选
// import projectionEffectDialog from 'cmm/dialogs/projectionEffect/projectionEffectDialog'; // 影片效果
// import filmDialog from 'cmm/dialogs/film/filmDialog.vue'; // 影片弹窗
// import filmTypeDialog from 'cmm/dialogs/filmType/filmTypeDialog.vue'; // 影片类型弹窗
// import cinemaTypeDialog from 'cmm/dialogs/cinemaType/cinemaTypeDialog.vue'; // 影院类型弹窗
// import tradeChannelDialog from 'cmm/dialogs/tradeChannel/tradeChannelDialog'; // 交易渠道

import cinemaMultipDialog from 'ccmSrc/dialogs/cmmDialogs/cinema/cinemaDialog'; // 影院弹窗 多选
import projectionEffectDialog from 'ccmSrc/dialogs/cmmDialogs/projectionEffect/projectionEffectDialog'; // 影片效果
import filmDialog from 'ccmSrc/dialogs/cmmDialogs/film/filmDialog.vue'; // 影片弹窗
import filmTypeDialog from 'ccmSrc/dialogs/cmmDialogs/filmType/filmTypeDialog.vue'; // 影片类型弹窗
import cinemaTypeDialog from 'ccmSrc/dialogs/cmmDialogs/cinemaType/cinemaTypeDialog.vue'; // 影院类型弹窗
import tradeChannelDialog from 'ccmSrc/dialogs/cmmDialogs/tradeChannel/tradeChannelDialog'; // 交易渠道

// import crmMemberLevelDialog from 'crm/dialogs/crmMemberLevel'; // 会员等级
// import crmCardPolicyDialog from 'crm/dialogs/crmCardPolicy'; // 会员卡政策
import crmMemberLevelDialog from 'ccmSrc/dialogs/crmMemberLevel'; // 会员等级
import crmCardPolicyDialog from 'ccmSrc/dialogs/crmCardPolicy'; // 会员卡政策

/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件
 */
let alertHandle = {
  components: {
    cinemaTreeDialog,
    cinemaMultipDialog,
    cinemaSingleDialog,
    selectedBrandSingle,
    selectedGoodsSingle,
    merClassSingle,
    tradeChannelDialog,
    tradeMerchantSingleDialog,
    filmDialog,
    filmTypeDialog,
    cinemaTypeDialog,
    crmMemberLevelDialog,
    crmCardPolicyDialog,
    findStartNum,
    projectionEffectDialog
  },
  data () {
    return {
      // 选择会员卡政策弹窗传入参数
      reviewData: [], // 回显参数

      cardPolicyDialogVisible: false, // 选择会员卡政弹窗状态

      // 选择会员等级
      memberLevelDatadialogVisible: false, // 选择会员等级弹窗状态
      reviewMemberLevelData: [],

      // 影院弹窗
      cinemaMultipDialog: {
        cinemaDialogVisible: false,
        title: '选择影院'
      },

      // 影片类型弹窗
      filmTypeDialog: {
        filmTypeDialogVisible: false,
        title: '选择影片类型'
      },
      // 影片弹窗
      filmDialog: {
        filmDialogVisible: false,
        title: '选择影片名称'
      },
      // 放映效果弹窗
      projectionEffectDialog: {
        projectionEffectDialogVisible: false,
        title: '选择影片效果'
      },
      // 交易渠道弹窗
      tradeChannelDialog: {
        tradeChannelDialogVisible: false,
        title: '选择交易渠道'
      },
      cinemaTypeDialog: {
        cinemaTypeDialogVisible: false,
        title: '影院类型弹窗'
      }
    };
  },

  methods: {
    /**
     * @function batchTicketIdsCallBack -预生成编号回调函数
     *
     */
    batchTicketIdsCallBack (data) {
      let valueArr = [];
      data.forEach(item => {
        valueArr.push(item.id);
      });
      this.form.baseInfo.batchTicketIds.value = valueArr.join(',');
      console.log('预生成编号回调', this.form.baseInfo.batchTicketIds.value);
    },
    /**
     * @function cinemaClick - 选择入账影院
     */
    cinemaCallBack (data) {
      console.log('选择影院');
      if (data) {
        this.form.baseInfo.incomeCinemaId.value = data.id;
        this.form.baseInfo.incomeCinemaId.text = data.text;
      }
    },
    /**
     *
     * @function {*}  影院范围多选
     *
     */
    handleRegisterCinemaCallBack (data) {
      console.log('回调多选选影院', data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.name);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.code);
      });
      this.form.commonInfo.cinemarangev.value = uidArr.join(',');
      this.form.commonInfo.cinemarangev.text = nameArr.join(',');
    },
    /**
     *
     * @function {*}  影院范围单选
     *
     */
    cinemaSingleCallBack (data) {
      console.log('回调单选影院', data);
      if (data) {
        this.form.commonInfo.cinemarangev.value = data.code;
        this.form.commonInfo.cinemarangev.text = data.name;
      }
    },
    /**
     * @function handleTradeMerchantCallBack - 交易商户回调处理函数
     */
    handleTradeMerchantCallBack (data) {
      console.log(data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.name);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.code);
      });
      this.basicDataForm.businessCode14.value = uidArr.join(',');
      this.basicDataForm.businessCode14.text = nameArr.join(',');
    },
    /**
     * @function cardPolicyDialogCallBack - 会员卡政策回调
     */
    cardPolicyDialogCallBack (databack) {
      let data = databack.data;
      console.log('会员卡政策回调', data);
      if (data.length) {
        let nameArr = [];
        data.map(item => {
          nameArr.push(item.cardName);
        });
        let uidArr = [];
        data.map(item => {
          uidArr.push(item.id);
        });
        this.form.commonInfo.cardPolicyCode.value = uidArr.join(',');
        this.form.commonInfo.cardPolicyCode.text = nameArr.join(',');
      }
    },

    /**
     * @function MemberLevelDialogCallBack - 会员等级回调
     */
    MemberLevelDialogCallBack (databack) {
      console.log(databack);
      let data = databack.data;
      console.log('会员等级回调', data);
      if (data.length) {
        let nameArr = [];
        data.map(item => {
          nameArr.push(item.levelName);
        });
        let uidArr = [];
        data.map(item => {
          uidArr.push(item.levelNo);
        });
        // 会员等级回调处理

        this.form.commonInfo.customerLevelCode.value = uidArr.join(',');
        this.form.commonInfo.customerLevelCode.text = nameArr.join(',');
      }
    },
    /**
     * @function handleProjectionEffectCallBack - 放映效果回调处理函数
     */
    handleProjectionEffectCallBack (data) {
      console.log(data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.propertyName);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.propertyCode);
      });

      this.addConfig.form.showEffectCode.value = uidArr.join(',');
      this.addConfig.form.showEffectCode.text = nameArr.join(',');
    },

    /**
     * @function handleStudioType - 影厅类型回调处理函数
     */
    handleStudioType (data) {
      console.log(data);
    },
    /**
     * @function cinemaTypeClick - 选择影厅类型
     */
    cinemaTypeClick () {
      this.$refs.cinemaTypeDialog.openDialog(true);
    },
    /**
     * @function handleFilmCallBack - 选择影厅类型回调
     */
    handleCinemaTypeCallBack (data) {
      console.log(data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.keyName);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.keyCode);
      });
      this.addConfig.form.hallTypeKey.value = uidArr.join(',');
      this.addConfig.form.hallTypeKey.text = nameArr.join(',');
    },

    /**
     * @function handleFilmCallBack - 选择影片名称回调函数
     */
    handleFilmCallBack (data) {
      console.log(data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.filmName);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.code);
      });
      this.addConfig.form.uniformCode.value = uidArr.join(',');
      this.addConfig.form.uniformCode.text = nameArr.join(',');
    },
    // /**
    //  * @function filmTypeClick - 选择影片类型
    //  */
    // filmTypeClick() {
    //     this.$refs.filmTypeDialog.openDialog(true)
    // },
    /**
     * @function handleFilmCallBack - 选择影片类型回调
     */
    handleFilmTypeCallBack (data) {
      console.log(data);
      let nameArr = [];
      data.map(item => {
        nameArr.push(item.propertyName);
      });
      let uidArr = [];
      data.map(item => {
        uidArr.push(item.propertyCode);
      });
      this.addConfig.form.filmTypeKey.value = uidArr.join(',');
      this.addConfig.form.filmTypeKey.text = nameArr.join(',');
    },
    // -----------------------------------卖品类弹窗----------------------------------

    /**
     * @function selectBrand  -选择品牌选择
     */
    // -回调
    selectedBrandSingleCallBack (data) {
      console.log('品牌：', data);
      if (data) {
        this.addConfig.form.brandName.value = data.uid;
        this.addConfig.form.brandName.text = data.name;
      }
    },
    /**
     * @function selectType  -选择类别
     */
    // -回调
    merClassSingleCallBack (data) {
      console.log('类别回调', data);
      if (data) {
        this.addConfig.form.className.value = data.uid;
        this.addConfig.form.className.text = data.name;
      }
    },
    /**
     * @function selectBrand  -选择商品名称
     */
    // -回调
    selectedGoodsSingleCallBack (data) {
      console.log('商品：', data);
      if (data) {
        let value = data.skuUid ? data.skuUid : data.uid;
        let text = data.skuName ? `${data.skuName}` : data.merName;
        this.addConfig.form.merName.value = value;
        this.addConfig.form.merName.text = text;
      }
    },

    // -----------------------------交易类---------------------------------------
    /* 选择交易客商 */
    // 回调
    tradeMerchantSingleCallBack (data) {
      console.log('交易客商', data);
      if (data) {
        this.form.baseInfo.custId.text = data.name;
        this.form.baseInfo.custId.value = data.id;
      }
    },

    // 交易渠道-回调函数
    handleOtherTradeChannelCallBack (data) {
      console.log('交易渠道', data);
      let textArr = [];
      let valueArr = [];
      data.forEach(item => {
        textArr.push(item.name);
        valueArr.push(item.code);
      });
      this.form.commonInfo.consumeWayCodeOp.text = textArr.join(',');
      this.form.commonInfo.consumeWayCodeOp.value = valueArr.join(',');
    }
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
  destroyed () {}
  /**
   * @property {Object} methods - 公用方法库
   */
};

export default alertHandle;
