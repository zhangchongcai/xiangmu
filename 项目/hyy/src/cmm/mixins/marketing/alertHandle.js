import cinemaDialog from "cmm/dialogs/cinema/cinemaDialog"; //影院弹窗
import cinemaTypeDialog from "cmm/dialogs/cinemaType/cinemaTypeDialog.vue"; //影厅类型弹窗
import filmDialog from "cmm/dialogs/film/filmDialog.vue"; //影片弹窗
import filmTypeDialog from "cmm/dialogs/filmType/filmTypeDialog.vue"; //影片类型弹窗
import cinemaAdminRegionDialog from 'cmm/dialogs/cinemaAdminRegion/cinemaAdminRegionDialog' //行政区域
import projectionEffectDialog from 'cmm/dialogs/projectionEffect/projectionEffectDialog' //放映效果
import orgStructureDialog from "cmm/dialogs/orgStructure/orgStructureDialog.vue"; //组织结构多个节点多选弹窗
import salePlace from 'cmm/dialogs/salePlace' //行政区域

import selBrandDialog from "cmm/dialogs/selectBrand"; //品牌弹窗
import selectedGoods from 'cmm/dialogs/selectedGoods' //选择商品
import selectedGoodsSingle from 'ccm/dialogs/selectedGoodsSingle' //选择商品 单选
import MerClass from 'cmm/dialogs/merClass' //选择类别

import tradeChannelDialog from 'cmm/dialogs/tradeChannel/tradeChannelDialog' //交易渠道
import tradeMerchantDialog from 'cmm/dialogs/tradeMerchant/tradeMerchantDialog' //交易客商
import payTypeDialog from 'cmm/dialogs/payType/payTypeDialog.vue'; //支付方式

import crmMemberLevelDialog from "crm/dialogs/crmMemberLevel"; //会员等级 
import crmCardTypeDialog from "crm/dialogs/crmCardType"; //会员卡类型
import crmCardPolicyDialog from "crm/dialogs/crmCardPolicy"; //会员卡政策

import couponBatchDialog from "cmm/dialogs/couponBatch/couponBatchDialog"; //票券批次多选
import couponBatchSingleDialog from "cmm/dialogs/couponBatch/couponBatchSingleDialog"; //票券批次单选


/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件 
 */
let alertHandle = {
    components: {
        payTypeDialog,
        selBrandDialog,
        selectedGoodsSingle,
        selectedGoods,
        MerClass,
        tradeChannelDialog,
        tradeMerchantDialog,
        cinemaTypeDialog,
        filmDialog,
        filmTypeDialog,
        cinemaDialog,
        crmMemberLevelDialog,
        crmCardTypeDialog,
        crmCardPolicyDialog,
        couponBatchDialog,
        couponBatchSingleDialog,
        salePlace,
        cinemaAdminRegionDialog,
        projectionEffectDialog,
        orgStructureDialog
    },
    data() {
        return {
            //选择会员等级弹窗传入参数
            reviewCrmMemberLevelData: [],
            crmMemberLevelDialogVisible: false, //选择会员等级弹窗 状态
            crmMemberLevelDialogWhereUse: "", //选择会员等级弹窗 引入标识
            //选择会员卡类型弹窗传入参数
            reviewCrmCardTypeData: [],
            crmCardTypeDialogVisible: false, //选择会员卡类型弹窗 状态
            crmCardTypeDialogWhereUse: "", //选择会员卡类型弹窗 引入标识
            //选择会员卡政策弹窗传入参数
            reviewCrmCardPolicyTypeData: [],
            crmCardPolicyDialogVisible: false, //选择会员卡政策弹窗 状态
            crmCardPolicyDialogWhereUse: "", //选择会员卡政策弹窗 引入标识
            //品牌弹窗
            brandQueryData: {
                list: {
                    id: ""
                }
            },
            //组织结构弹窗
            orgStructureDialog: {
                orgStructureDialogVisible: false,
                title: "选择组织结构",
            },
            //支付方式弹窗
            payTypeDialog: {
                payTypeDialogVisible: false,
                title: "选择支付方式",
            },
            //票券批次多选弹窗
            couponBatchDialog: {
                couponBatchDialogVisible: false,
                title: "选择票券批次",
            },
            //票券批次单选弹窗
            couponBatchSingleDialog: {
                couponBatchSingleDialogVisible: false,
                title: "选择票券批次",
            },
            //交易客商弹窗
            tradeMerchantDialog: {
                tradeMerchantDialogVisible: false,
                title: "选择交易客商",
            },
            //交易渠道弹窗
            tradeChannelDialog: {
                tradeChannelDialogVisible: false,
                title: "选择交易渠道",
            },
            //影院行政区域弹窗
            cinemaAdminRegionDialog: {
                cinemaAdminRegionDialogVisible: false,
                title: "选择交易影院行政区域",
            },
            //放映效果弹窗
            projectionEffectDialog: {
                projectionEffectDialogVisible: false,
                title: "选择放映效果",
            },
            //影厅类型弹窗
            cinemaTypeDialog: {
                cinemaTypeDialogVisible: false,
                title: "选择影厅类型",
            },
            //影院弹窗
            cinemaDialog: {
                cinemaDialogVisible: false,
                title: "选择影院",
            },
            //影片类型弹窗
            filmTypeDialog: {
                filmTypeDialogVisible: false,
                title: "选择影片类型",
            },
            //影片弹窗
            filmDialog: {
                filmDialogVisible: false,
                title: "选择影片",
            },
            //品牌弹窗
            selBrandDialog: {
                title: "选择品牌",
            },
            //选择商品
            whereSelectedGoodsName: '',
            selectedGoodsDialogVisible: false, //必填显隐控制
            selectedFeedbackData: [], //可选，回选数组，不传为不回选
        }
    },

    /**
     * @function beforeCreate - 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
     */
    beforeCreate() {},
    /**
     * @function create - 在实例创建完成后被立即调用
     */
    create() {},
    /**
     * @function beforedMounted 在挂载开始之前被调用：相关的 render 函数首次被调用
     */
    beforedMounted() {},
    /**
     * @function mounted - el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
     */
    mounted() {},
    /**
     * @function beforeUpdate - 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
     */
    beforeUpdate() {},
    /**
     * @function update - 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
     */
    update() {},
    /**
     * @function beforeDestroy - 实例销毁之前调用
     */
    beforeDestroy() {},
    /**
     * @function destroyed - Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
     */
    destroyed() {},
    /**
     * @property {Object} methods - 公用方法库
     */
    methods: {
        //------------------------------已弃用-交易客商start------------------------------------
        // 已弃用-交易客商-点击开启弹窗
        tradingMerchantClick() {
            this.$refs.tradeMerchantDialog.openDialog(true)
        },
        // 已弃用-交易客商-（自定义营销页面）回调函数
        handleTradeMerchantCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.businessCode14.value = uidArr.join(',')
            this.basicDataForm.businessCode14.text = nameArr.join(',')
        },
        //-----------------------------已弃用-交易客商end------------------------------------
        //-----------------------------交易渠道start------------------------------------
        // 交易渠道-点击开启弹窗
        tradeChannelClick() {
            this.$refs.tradeChannelDialog.openDialog(true)
        },
        // 交易渠道-（自定义营销页面）回调函数
        handleTradeChannelCallBack(data) {
            console.log(data)
            let textArr = []
            let valueArr = []
            data.forEach(item => {
                textArr.push(item.name)
                valueArr.push(item.code)
            });
            console.log(textArr)
            console.log(valueArr)
            this.basicDataForm.tradingChannelInput = textArr.join(",");
            this.basicDataForm.tradingChannelId = valueArr.join(',');
        },
        // 交易渠道-（除去自定义营销页面）回调函数
        handleOtherTradeChannelCallBack(data) {
            console.log(data)
            let textArr = []
            let valueArr = []
            data.forEach(item => {
                textArr.push(item.name)
                valueArr.push(item.code)
            });
            console.log(textArr)
            console.log(valueArr)
            this.basicDataForm.tradingChannelInput = textArr.join(",");
            this.basicDataForm.tradingChannelId = valueArr.join(',');
        },

        //-----------------------------交易渠道end------------------------------------
        //-----------------------------放映效果start------------------------------------
        // 放映效果-点击开启弹窗
        projectionEffectClick() {
            this.$refs.projectionEffectDialog.openDialog(true)
        },
        // 放映效果-（自定义营销页面）回调函数
        handleProjectionEffectCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })

            this.basicDataForm.showEffect35.value = uidArr.join(',')
            this.basicDataForm.showEffect35.text = nameArr.join(',')
        },
        // 放映效果-（除去自定义营销页面）回调函数
        handleOtherProjectionEffectCallBack(data) {
            console.log(data);
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })

            this.basicDataForm.projectionEffectId = uidArr.join(',')
            this.basicDataForm.projectionEffectInput = nameArr.join(',')
        },
        //-----------------------------放映效果end------------------------------------
        //-----------------------------影院行政区域start------------------------------------
        // 已弃用-影院行政区域-点击开启弹窗
        cinemaAdminRegionClick() {
            this.$refs.cinemaAdminRegionDialog.openDialog(true)
        },
        // 已弃用-影院行政区域-（自定义营销页面）回调函数
        handleCinemaAdminRegionCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.placeName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.cinemaAreaId25.value = uidArr.join(',')
            this.basicDataForm.cinemaAreaId25.text = nameArr.join(',')
        },
        // 影院行政区域（组织结构）-点击开启弹窗
        orgStructureClick() {
            this.$refs.orgStructureDialog.openDialog(true)
        },
        // 影院行政区域（组织结构）-（自定义营销页面）回调函数
        handleOrgStructureBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.text) })
            let uidArr = []
            data.map(item => { uidArr.push(item.id) });
            this.basicDataForm.cinemaAreaId25.value = uidArr.join(',')
            this.basicDataForm.cinemaAreaId25.text = nameArr.join(',')
            console.log("cinemaAreaId25.value=", this.basicDataForm.cinemaAreaId25.value)
            console.log("cinemaAreaId25.text=", this.basicDataForm.cinemaAreaId25.text)
        },
        //-----------------------------影院行政区域end------------------------------------
        //-----------------------------影院start------------------------------------
        // 影院-点击开启弹窗
        cinemaClick(cinemaDialog) {
            this.$refs[`${cinemaDialog}`].openDialog(true)
        },
        // 注册影院-（自定义营销页面）回调函数
        handleRegisterCinemaCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.registerBusinessCode13.value = uidArr.join(',')
            this.basicDataForm.registerBusinessCode13.text = nameArr.join(',')
        },
        // 已弃用-交易影院-（自定义营销页面）回调函数
        handleTradeCinemaCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.cinemaCode19.value = uidArr.join(',')
            this.basicDataForm.cinemaCode19.text = nameArr.join(',')
        },
        // 注册影院、交易影院-（除去自定义营销页面）回调函数
        handleMovieTicketCinemaDialogCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.tradingMerchantId = uidArr.join(',')
            this.basicDataForm.tradingMerchantInput = nameArr.join(',')
        },
        //-----------------------------影院end------------------------------------
        //-----------------------------影片start------------------------------------

        // 影片-点击开启弹窗
        filmClick() {
            this.$refs.filmDialog.openDialog(true)
        },
        // 影片-（自定义营销页面）回调函数
        handleFilmCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.filmName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })
            this.basicDataForm.uniformCode79.value = uidArr.join(',')
            this.basicDataForm.uniformCode79.text = nameArr.join(',')
        },
        // 影片-（除去自定义营销页面）回调函数
        handleMovieTicketFilmCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.filmName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })
            this.basicDataForm.filmId = uidArr.join(',')
            this.basicDataForm.filmInput = nameArr.join(',')
        },
        //-----------------------------影片end------------------------------------
        //-----------------------------影厅类型start------------------------------------
        // 影厅类型-点击开启弹窗
        cinemaTypeClick() {
            this.$refs.cinemaTypeDialog.openDialog(true)
        },
        // 影厅类型-（自定义营销页面）回调函数
        handleCinemaTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.keyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.keyCode) })
            this.basicDataForm.hallTypeKey36.value = uidArr.join(',')
            this.basicDataForm.hallTypeKey36.text = nameArr.join(',')
        },
        // 影厅类型-（除去自定义营销页面）回调函数
        handleMovieTicketCinemaTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.keyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.keyCode) })
            this.basicDataForm.studioTypeId = uidArr.join(',')
            this.basicDataForm.studioTypeInput = nameArr.join(',')
        },
        //-----------------------------影厅类型end------------------------------------
        //-----------------------------影片类型start------------------------------------
        // 影片类型-点击开启弹窗
        filmTypeClick() {
            this.$refs.filmTypeDialog.openDialog(true)
        },
        // 影片类型-（自定义营销页面）回调函数
        handleFilmTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })
            this.basicDataForm.filmTypeKey34.value = uidArr.join(',')
            this.basicDataForm.filmTypeKey34.text = nameArr.join(',')
        },
        // 影片类型-（除去自定义营销页面）回调函数
        handleMovieTicketFilmTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })
            this.basicDataForm.filmTypeId = uidArr.join(',')
            this.basicDataForm.filmTypeInput = nameArr.join(',')
        },
        //-----------------------------影片类型end------------------------------------
        //-----------------------------支付方式start------------------------------------
        // 支付方式-点击开启弹窗
        payTypeClick() {
            this.$refs.payTypeDialog.openDialog(true);
        },
        // 支付方式-（自定义营销页面）回调函数
        handlePayTypeCounterUseCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.payTypeName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.payTypeCode) })

            this.basicDataForm.payTypeCode86.value = uidArr.join(',')
            this.basicDataForm.payTypeCode86.text = nameArr.join(',')
        },
        // 支付方式-（除去自定义营销页面）回调函数
        handlePayTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.payTypeName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.payTypeCode) })

            this.basicDataForm.payTypeId = uidArr.join(',')
            this.basicDataForm.payTypeInput = nameArr.join(',')
        },
        //-----------------------------支付方式end------------------------------------
        //-----------------------------会员类-会员等级、消费者身份start------------------------------------
        // 会员等级、消费者身份-点击开启弹窗
        membershipLevelClick(whereUse) {
            this.crmMemberLevelDialogWhereUse = whereUse
            this.crmMemberLevelDialogVisible = true
        },
        // 会员等级、消费者身份-回调函数
        handleMembershipLevel(data) {
            console.log(data)
            let nameArr = []
            data.data.map(item => { nameArr.push(item.levelName) });
            let uidArr = []
            data.data.map(item => { uidArr.push(item.id) });

            //会员等级-（自定义营销页面）回调函数
            if (this.crmMemberLevelDialogWhereUse == "crmMemberLevelDialog") {
                this.basicDataForm.customerLevelCode101.value = uidArr.join(',')
                this.basicDataForm.customerLevelCode101.text = nameArr.join(',')
            }
            // 会员等级-（除去自定义营销页面）回调函数
            if (this.crmMemberLevelDialogWhereUse == "otherCrmMemberLevelDialog") {
                this.basicDataForm.customerLevelId = uidArr.join(',')
                this.basicDataForm.customerLevelInput = nameArr.join(',')
            }
        },
        //-----------------------------会员类-会员等级、消费者身份end------------------------------------
        //-----------------------------会员类-会员卡类型start------------------------------------
        // 会员卡类型-点击开启弹窗
        cardRightCodeClick(whereUse) {
            this.crmCardTypeDialogWhereUse = whereUse;
            this.crmCardTypeDialogVisible = true;
        },
        // 会员卡类型-（自定义营销页面）回调函数
        handleCardshipType(data) {
            console.log(data)
            let nameArr = []
            data.data.map(item => { nameArr.push(item.cardType) })
            let uidArr = []
            data.data.map(item => { uidArr.push(item.cardTypeCode) })
            this.basicDataForm.cardTypeKey10.value = uidArr.join(',')
            this.basicDataForm.cardTypeKey10.text = nameArr.join(',')
        },
        //-----------------------------会员类-会员卡类型end------------------------------------
        //-----------------------------会员类-会员卡政策start------------------------------------
        // 会员卡政策-点击开启弹窗
        cardPolicyClick(whereUse) {
            this.crmCardPolicyDialogWhereUse = whereUse
            this.crmCardPolicyDialogVisible = true
        },
        // 会员卡政策-回调函数
        handleCardPolicy(data) {
            console.log(data)
            let nameArr = []
            data.data.map(item => { nameArr.push(item.cardName) });
            let uidArr = []
            data.data.map(item => { uidArr.push(item.id) });

            //会员卡政策-（自定义营销页面）回调函数
            if (this.crmCardPolicyDialogWhereUse == "crmCardPolicyDialog") {
                this.basicDataForm.cardRightCode100.value = uidArr.join(',')
                this.basicDataForm.cardRightCode100.text = nameArr.join(',')
            }
            //消费者身份-（自定义营销页面）回调函数
            if (this.crmCardPolicyDialogWhereUse == "consumerIdentityDialog") {
                this.basicDataForm.consumerTypeKey27.value = uidArr.join(',')
                this.basicDataForm.consumerTypeKey27.text = nameArr.join(',')
            }
            //消费者身份-（影票活动管理、卖品活动管理、套票促销活动管理 三个页面）回调函数
            if (this.crmCardPolicyDialogWhereUse == "movieTicketConsumerIdentityDialog") {
                this.basicDataForm.consumerIdentityId = uidArr.join(',')
                this.basicDataForm.consumerIdentityInput = nameArr.join(',')
            }
            //会员卡政策-（赠送：票券、余额、积分v三个页面）回调函数
            if (this.crmCardPolicyDialogWhereUse == "giftMembershipLevelDialog") {
                this.basicDataForm.membershipLevelId = uidArr.join(',')
                this.basicDataForm.membershipLevelInput = nameArr.join(',')
            }
        },
        //-----------------------------会员类-会员卡政策end------------------------------------
        //-----------------------------票券批次（多选）start------------------------------------
        //票券批次（多选）-点击开启弹窗
        couponBatchClick(couponBatchDialog) {
            this.$refs[`${couponBatchDialog}`].openDialog(true);
        },
        //票券批次（多选）-（自定义营销页面）回调函数
        handleCouponBatchCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.couponName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.applyCode) })

            this.basicDataForm.giftTicket.couponApplyCode3.value = uidArr.join(',')
            this.basicDataForm.giftTicket.couponApplyCode3.text = nameArr.join(',')
        },
        //票券批次（多选）-（赠送票券活动管理页面）回调函数
        handleGiftCouponBatchCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.couponName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.applyCode) })

            this.basicDataForm.giftTicketId = uidArr.join(',')
            this.basicDataForm.giftTicketInput = nameArr.join(',')
        },
        //-----------------------------票券批次（多选）end------------------------------------
        //-----------------------------票券批次（单选）start------------------------------------
        //票券批次（单选）-点击开启弹窗
        couponBatchSingleClick(couponBatchSingleDialog) {
            console.log(couponBatchSingleDialog)
            this.$refs[`${couponBatchSingleDialog}`].openDialog(true);
        },
        //票券批次（单选）-（自定义营销页面）回调函数
        handleCouponBatchSingleCallBack(data) {
            console.log(data)
            this.basicDataForm.giftTicket.couponApplyCode3.value = data.applyCode
            this.basicDataForm.giftTicket.couponApplyCode3.text = data.couponName
        },
        //票券批次（单选）-（赠送票券活动管理页面）回调函数
        handleGiftCouponBatchSingleCallBack(data) {
            console.log(data)
            this.basicDataForm.giftTicketId = data.applyCode
            this.basicDataForm.giftTicketInput = data.couponName
        },
        //-----------------------------票券批次（单选）end------------------------------------






        //-----------------------------------卖品类弹窗start----------------------------------
        /**
         * @function selectBrand  -选择品牌选择
         */
        brandNameClick(whereUse) {
            this.$refs[whereUse].openDialog(true)
        },
        //-回调
        SelBrandCallBack(data) {
            this.basicDataForm.brandId40.value = data.valueArr.join(',')
            this.basicDataForm.brandId40.text = data.textArr.join(',')
        },
        youhuiBrandcallBack(data) {
            this.basicDataForm.judgeDiscountPriceByBrand.brandId28.value = data.valueArr.join(',')
            this.basicDataForm.judgeDiscountPriceByBrand.brandId28.text = data.textArr.join(',')
        },

        /**
         * @function selectType  -选择类别
         */
        selectType(ref) {
            this.$refs[ref].openMerClassTree()
        },
        /*同类商品累计购买数量 - 选择商品类别 */
        //-回调
        selectMerClassCallBack(data) {
            this.basicDataForm.classCode41.text = data.textArr.join(',')
            this.basicDataForm.classCode41.value = data.valueArr.join(',')
        },
        sameMerClassCallBack(data) {
            this.basicDataForm.buyNumByType.classCode28.text = data.textArr.join(',')
            this.basicDataForm.buyNumByType.classCode28.value = data.valueArr.join(',')
        },
        maiPingMerClassCallBack(data) {
            this.basicDataForm.judgeDiscountPriceByType.classCode27.text = data.textArr.join(',')
            this.basicDataForm.judgeDiscountPriceByType.classCode27.value = data.valueArr.join(',')
        },
        /**
         * @function selectBrand  -选择商品名称 点击事件
         */
        selectGoodsClick(whereUse) {

            // console.log(ref)
            //单选
            if (this.$refs[whereUse]) {
                this.$refs[whereUse].openDialog()
            } else {
                this.whereSelectedGoodsName = whereUse
                this.selectedGoodsDialogVisible = true
                console.log(whereUse)
                    // if(whereUse == "tradeGoods") {
                    //     this.selectedFeedbackData = this.basicDataForm.merKey46.value ? this.basicDataForm.merKey46.value.split(',') : []
                    // }else if(whereUse == "appointGoods") {
                    //     this.selectedFeedbackData = this.basicDataForm.buyNum.merKey21.value ? this.basicDataForm.buyNum.merKey21.value.split(',') : []
                    // }else if (whereUse == "salesSelectedGoods") {
                    //     this.selectedFeedbackData =  this.basicDataForm.goodsId ? this.basicDataForm.goodsId.split(',') : []
                    // }else if (whereUse == "selectedGoods") {
                    //     this.selectedFeedbackData = this.basicDataForm.tradeNameId ? this.basicDataForm.tradeNameId.split(',') : []
                    // }
            }
        },
        /**
         * @function  卖品回调函数
         */
        cimSelectedGoodsDialogCallBack(data) {
            let Arr = data.data
            let valueArr = []
            let textArr = []
            Arr.map(item => {
                if (item.skuUid) {
                    valueArr.push(item.skuUid)
                } else {
                    valueArr.push(item.uid)
                }
                if (item.skuName) {
                    textArr.push(item.skuName)
                } else {
                    textArr.push(item.merName)
                }
            })
            if (this.whereSelectedGoodsName == "tradeGoods") {
                this.basicDataForm.merKey46.value = valueArr.join(',')
                this.basicDataForm.merKey46.text = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "appointGoods") {
                this.basicDataForm.buyNum.merKey21.value = valueArr.join(',')
                this.basicDataForm.buyNum.merKey21.text = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "salesSelectedGoods") {
                this.basicDataForm.goodsId = valueArr.join(',')
                this.basicDataForm.goodsInput = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "selectedGoods") {
                this.basicDataForm.tradeNameId = valueArr.join(',')
                this.basicDataForm.tradeNameInput = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "singleGoods") {
                this.basicDataForm.judgeDiscountPrice.merKey9.value = valueArr.join(',')
                this.basicDataForm.judgeDiscountPrice.merKey9.text = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "favorablePrice") {
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.value = valueArr.join(',')
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.text = textArr.join(',')
            } else if (this.whereSelectedGoodsName == "zengSongGoods") {
                this.basicDataForm.giftGoods.merKey11.value = valueArr.join(',')
                this.basicDataForm.giftGoods.merKey11.text = textArr.join(',')
            }
            console.log("valueArr:", valueArr)
            console.log("textArr:", textArr)
        },
        //-回调
        // tradeGoodsCallBack(data) {
        //     this.basicDataForm.merKey46.value = data.valueArr.join(',')
        //     this.basicDataForm.merKey46.text = data.textArr.join(',')
        // },
        // appointGoodsBack(data) {

        //     this.basicDataForm.buyNum.merKey21.value = data.valueArr.join(',')
        //     this.basicDataForm.buyNum.merKey21.text = data.textArr.join(',')
        // },
        // salesSelectedGoodsCallBack(data) {
        //     this.basicDataForm.goodsId = data.valueArr.join(',')
        //     this.basicDataForm.goodsInput = data.textArr.join(',')
        // },
        // selectedGoodsCallBack(data) {
        //     this.basicDataForm.tradeNameId = data.valueArr.join(',')
        //     this.basicDataForm.tradeNameInput = data.textArr.join(',')
        // },
        /**
         * 
         * @param {*} data //-----卖品的单选弹窗回调
         */
        zengSongGoodsCallBack(data) {
            // let value = data.merType == "4" ? data.uid : data.skuUid
            if (data.skuUid) {
                this.basicDataForm.giftGoods.merKey11.value = data.skuUid
            } else {
                this.basicDataForm.giftGoods.merKey11.value = data.uid
            }
            if (data.skuName) {
                this.basicDataForm.giftGoods.merKey11.text = data.skuName
            } else {
                this.basicDataForm.giftGoods.merKey11.text = data.merName
            }
        },
        singleGoodsCallBack(data) {
            if (data.skuUid) {
                this.basicDataForm.judgeDiscountPrice.merKey9.value = data.skuUid
            } else {
                this.basicDataForm.judgeDiscountPrice.merKey9.value = data.uid
            }
            if (data.skuName) {
                this.basicDataForm.judgeDiscountPrice.merKey9.text = data.skuName
            } else {
                this.basicDataForm.judgeDiscountPrice.merKey9.text = data.merName
            }
        },
        favorablePriceCallBack(data) {
            if (data.skuUid) {
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.value = data.skuUid
            } else {
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.value = data.uid
            }
            if (data.skuName) {
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.text = data.skuName
            } else {
                this.basicDataForm.addGoodsWithDiscountPrice.merKey10.text = data.merName
            }
        },
        //套票
        packageSelectedGoodsCallBack(data) {
            if (data.skuUid) {
                this.basicDataForm.tradeNameId = data.skuUid
            } else {
                this.basicDataForm.tradeNameId = data.uid
            }
            if (data.skuName) {
                this.basicDataForm.tradeNameInput = data.skuName
            } else {
                this.basicDataForm.tradeNameInput = data.merName
            }
        },
        //-----------------------------------卖品类弹窗end----------------------------------

    }
};

export default alertHandle;