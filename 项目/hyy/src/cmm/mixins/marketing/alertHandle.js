import payType from 'csm/components/payType/PayType.vue'; // 支付方式
import payTypeDialog from 'cmm/dialogs/payType/payTypeDialog.vue'; //支付方式
import cinemaDialog from "cmm/dialogs/cinema/cinemaDialog"; //影院弹窗
import cinemaTypeDialog from "cmm/dialogs/cinemaType/cinemaTypeDialog.vue"; //影院类型弹窗
import filmDialog from "cmm/dialogs/film/filmDialog.vue"; //影片弹窗
import filmTypeDialog from "cmm/dialogs/filmType/filmTypeDialog.vue"; //影片类型弹窗
import selBrandDialog from "cmm/dialogs/selectBrand"; //品牌弹窗
import selectedGoods from 'cmm/dialogs/selectedGoods' //选择商品
import MerClass from 'cmm/dialogs/merClass' //选择类别
import TradeChannel from 'cmm/dialogs/tradeChannel' //交易渠道
import tradeMerchantDialog from 'cmm/dialogs/tradeMerchant/tradeMerchantDialog' //交易商户
import crmMemberLevelDialog from "crm/dialogs/crmMemberLevel"; //会员等级
import couponBatchDialog from "cmm/dialogs/couponBatch/couponBatchDialog"; //票券批次
import salePlace from 'cmm/dialogs/salePlace' //行政区域

/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件 
 */
let alertHandle = {
    components: {
        payType,
        payTypeDialog,
        selBrandDialog,
        selectedGoods,
        MerClass,
        TradeChannel,
        tradeMerchantDialog,
        cinemaTypeDialog,
        filmDialog,
        filmTypeDialog,
        cinemaDialog,
        crmMemberLevelDialog,
        couponBatchDialog,
        salePlace
    },
    data() {
        return {
            //选择会员等级弹窗传入参数
            reviewCrmMemberLevelData: [],
            crmMemberLevelDialogVisible: false, //选择会员等级弹窗状态
            crmMemberLevelDialogWhereUse: "", //选择会员弹窗引入标识
            //品牌弹窗
            brandQueryData: {
                list: {
                    id: ""
                }
            },
            //支付方式弹窗
            payTypeDialog: {
                payTypeDialogVisible: false,
                title: "支付方式弹窗",
            },
            //票券批次弹窗
            couponBatchDialog: {
                couponBatchDialogVisible: false,
                title: "票券批次弹窗",
            },
            //交易商户弹窗
            tradeMerchantDialog: {
                tradeMerchantDialogVisible: false,
                title: "交易商户弹窗",
            },
            //影院类型弹窗
            cinemaTypeDialog: {
                cinemaTypeDialogVisible: false,
                title: "影院类型弹窗",
            },
            //影院弹窗
            cinemaDialog: {
                cinemaDialogVisible: false,
                title: "影院弹窗",
            },
            //影片类型弹窗
            filmTypeDialog: {
                filmTypeDialogVisible: false,
                title: "影片类型弹窗",
            },
            //影片弹窗
            filmDialog: {
                filmDialogVisible: false,
                title: "影片弹窗",
            },
            //品牌弹窗
            selBrandDialog: {
                title: "品牌弹窗",
            },
            //选择商品
            selectedGoodsDialogVisible: false, //必填显隐控制
            dialogFeedbackData: '', //可选，回选数组，不传为不回选
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
        /**
         *  @function tradingMerchantClick - 选择交易商户
         */
        tradingMerchantClick() {
            console.log("tradeMerchant")
                // this.cinemaType.cinemaTypeDialogVisible = true
            this.$refs.tradeMerchantDialog.openDialog(true)
        },
        /**
         * @function handleTradeMerchantCallBack - 交易商户回调处理函数
         */
        handleTradeMerchantCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })
            this.basicDataForm.businessCode14.value = uidArr.join(',')
            this.basicDataForm.businessCode14.text = nameArr.join(',')
        },
        /** 
         * @function consumerIdentityClick - 选择消费者身份
         */
        consumerIdentityClick() {

        },
        /**
         * @function handleConsumerIdentity - 消费者身份回调处理函数
         */
        handleConsumerIdentity(data) {
            console.log(data);

        },
        /**
         *  @function projectionEffectClick - 选择放映效果
         */
        projectionEffectClick() {},
        /**
         * @function handleProjectionEffect - 放映效果回调处理函数
         */
        handleProjectionEffect(data) {
            console.log(data);
        },
        /**
         * @function studioTypeClick - 选择影厅类型
         */
        studioTypeClick() {},
        /**
         * @function handleStudioType - 影厅类型回调处理函数
         */
        handleStudioType(data) {
            console.log(data);
        },
        /**
         * @function cinemaClick - 选择影院
         */
        cinemaClick(cinemaDialog) {
            this.$refs[`${cinemaDialog}`].openDialog(true)
        },
        /**
         * @function handleRegisterCinemaCallBack - 选择注册影院回调函数
         */
        handleRegisterCinemaCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.registerBusinessCode13.value = uidArr.join(',')
            this.basicDataForm.registerBusinessCode13.text = nameArr.join(',')
        },
        /**
         * @function handleTradeCinemaCallBack - 选择交易影院回调函数
         */
        handleTradeCinemaCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.cinemaCode19.value = uidArr.join(',')
            this.basicDataForm.cinemaCode19.text = nameArr.join(',')
        },
        /**
         * @function handleMovieTicketDialogCallBack - 选择MovieTicket交易影院回调函数
         */
        handleMovieTicketCinemaDialogCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })

            this.basicDataForm.tradingMerchantId = uidArr.join(',')
            this.basicDataForm.tradingMerchantInput = nameArr.join(',')
        },
        /**
         * @function filmClick - 选择影片
         */
        filmClick() {
            this.$refs.filmDialog.openDialog(true)
        },
        /**
         * @function handleFilmCallBack - 选择影片回调函数
         */
        handleFilmCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.filmName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })
            this.basicDataForm.uniformCode79.value = uidArr.join(',')
            this.basicDataForm.uniformCode79.text = nameArr.join(',')
        },
        /**
         * @function handleFilmCallBack - 选择MovieTicket影片回调函数
         */
        handleMovieTicketFilmCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.filmName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) })
            this.basicDataForm.filmId = uidArr.join(',')
            this.basicDataForm.filmInput = nameArr.join(',')
        },


        /**
         * @function cinemaTypeClick - 选择影院类型
         */
        cinemaTypeClick() {
            this.$refs.cinemaTypeDialog.openDialog(true)
        },
        /**
         * @function handleFilmCallBack - 选择影院类型回调
         */
        handleCinemaTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.keyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.keyCode) })
            this.basicDataForm.hallTypeKey36.value = uidArr.join(',')
            this.basicDataForm.hallTypeKey36.text = nameArr.join(',')
        },
        /**
         * @function handleFilmCallBack - 选择MovieTicket影院类型回调
         */
        handleMovieTicketCinemaTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.keyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.keyCode) })
            this.basicDataForm.studioTypeId = uidArr.join(',')
            this.basicDataForm.studioTypeInput = nameArr.join(',')
        },
        /**
         * @function filmTypeClick - 选择影片类型
         */
        filmTypeClick() {
            this.$refs.filmTypeDialog.openDialog(true)
        },
        /**
         * @function handleMovieTicketFilmTypeCallBack - 选择MovieTicket影片类型回调
         */
        handleMovieTicketFilmTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })
            this.basicDataForm.filmTypeId = uidArr.join(',')
            this.basicDataForm.filmTypeInput = nameArr.join(',')
        },
        /**
         * @function handleFilmCallBack - 选择影片类型回调
         */
        handleFilmTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })
            this.basicDataForm.filmTypeKey34.value = uidArr.join(',')
            this.basicDataForm.filmTypeKey34.text = nameArr.join(',')
        },
        //-----------------------------------卖品类弹窗----------------------------------

        /**
         * @function selectBrand  -选择品牌选择
         */
        brandNameClick(ref) {
            this.$refs[ref].openDialog(true)
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
        //-回调
        selectMerClassCallBack(data) {

            this.basicDataForm.classCode41.text = data.textArr.join(',')
            this.basicDataForm.classCode41.value = data.valueArr.join(',')
        },
        /*同类商品累计购买数量 - 选择商品类别 */
        //-回调
        ClassCallBack() {

        },
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
         * @function selectBrand  -选择商品名称 
         */
        selectGoodsClick(ref) {
            console.log(ref)
            this.$refs[ref].openDialog()
        },
        //-回调
        tradeGoodsCallBack(data) {
            this.basicDataForm.merKey46.value = data.valueArr.join(',')
            this.basicDataForm.merKey46.text = data.textArr.join(',')
        },
        appointGoodsBack(data) {

            this.basicDataForm.buyNum.merKey21.value = data.valueArr.join(',')
            this.basicDataForm.buyNum.merKey21.text = data.textArr.join(',')
        },
        zengSongGoodsCallBack(data) {
            console.log(data)
            this.basicDataForm.giftGoods.merKey11.value = data.valueArr.join(',')
            this.basicDataForm.giftGoods.merKey11.text = data.textArr.join(',')
        },
        singleGoodsCallBack(data) {

            this.basicDataForm.judgeDiscountPrice.merKey9.value = data.valueArr.join(',')
            this.basicDataForm.judgeDiscountPrice.merKey9.text = data.textArr.join(',')
        },
        favorablePriceCallBack(data) {

            this.basicDataForm.addGoodsWithDiscountPrice.merKey10.value = data.valueArr.join(',')
            this.basicDataForm.addGoodsWithDiscountPrice.merKey10.text = data.textArr.join(',')
        },
        salesSelectedGoodsCallBack(data) { 
            this.basicDataForm.goodsId = data.valueArr.join(',')
            this.basicDataForm.goodsInput = data.textArr.join(',')
        },
        selectedGoodsCallBack(data) {
            this.basicDataForm.tradeNameId = data.valueArr.join(',')
            this.basicDataForm.tradeNameInput = data.textArr.join(',')
        },
        //-----------------------------交易类---------------------------------------
        /* 选择交易渠道 */
        handleChangeTradeChannel() {
            this.$refs.TradeChannel.openDialog(true)
        },
        //-回调
        TrandeChannelcallbackData(data) {
            console.log("渠道回调数据:", data)
            let textArr = []
            let valueArr = []
            data.forEach(item => {
                textArr.push(item.agent)
                valueArr.push(item.uid)
            });
            console.log(textArr)
            this.basicDataForm.consumeWayCode32.text = textArr.join(",");
            this.basicDataForm.consumeWayCode32.value = valueArr.join(',');
        },

        /* 选择交易影院行政区域 */
        selectTradeCinemaArea() {
            this.$refs.salePlace.openDialog()
        },
        //-回调
        salePlaceCallBack(data) {
            console.log("行政回调数据:", data)
            let textArr = []
            let valueArr = []
            data.forEach(item => {
                textArr.push(item.agent)
                valueArr.push(item.uid)
            });
            console.log(textArr)
            this.basicDataForm.consumeWayCode32.text = textArr.join(",");
            this.basicDataForm.consumeWayCode32.value = valueArr.join(',');
        },
        /**
         * @function handleFilmType - 影片类型回调处理函数
         */
        handleFilmType() {},

        /**
         * @function membershipLevelClick - 选择会员等级
         */
        membershipLevelClick(whereUse) {
            this.crmMemberLevelDialogWhereUse = whereUse
            this.crmMemberLevelDialogVisible = true
        },
        /**
         * @function handleMembershipLevel - 会员等级回调处理函数
         */
        handleMembershipLevel(data) {
            console.log(data)
            let nameArr = []
            data.data.map(item => { nameArr.push(item.levelName) })
            let uidArr = []
            data.data.map(item => { uidArr.push(item.id) })
                //会员等级回调处理
            if (this.crmMemberLevelDialogWhereUse == "crmMemberLevelDialog") {
                this.basicDataForm.cardTypeKey10.value = uidArr.join(',')
                this.basicDataForm.cardTypeKey10.text = nameArr.join(',')
            }
            //消费者身份（会员等级）回调处理
            if (this.crmMemberLevelDialogWhereUse == "consumerIdentityDialog") {
                this.basicDataForm.consumerTypeKey27.value = uidArr.join(',')
                this.basicDataForm.consumerTypeKey27.text = nameArr.join(',')
            }
            //movieTicket消费者身份（会员等级）回调处理
            if (this.crmMemberLevelDialogWhereUse == "movieTicketConsumerIdentityDialog") {
                this.basicDataForm.consumerIdentityId = uidArr.join(',')
                this.basicDataForm.consumerIdentityInput = nameArr.join(',')
            }
            //会员等级（赠送相关页面）  回调处理
            if (this.crmMemberLevelDialogWhereUse == "giftMembershipLevelDialog") {
                this.basicDataForm.membershipLevelId = uidArr.join(',')
                this.basicDataForm.membershipLevelInput = nameArr.join(',')
            }
        },
        /**
         * @function handleConsumerIdentityCallBack - 消费者身份（会员等级）回调处理函数
         */
        handleConsumerIdentityCallBack(data) {
            console.log(data)
            let nameArr = []
            data.data.map(item => { nameArr.push(item.levelName) })
            let uidArr = []
            data.data.map(item => { uidArr.push(item.id) })

            this.basicDataForm.consumerTypeKey27.value = uidArr.join(',')
            this.basicDataForm.consumerTypeKey27.text = nameArr.join(',')
        },
        /**
         * @function payTypeClick - 支付方式
         */
        payTypeClick() {
            this.$refs.payTypeDialog.openDialog(true);
        },
        /**
         * @function handlePayTypeCallBack - 支付方式回调处理函数
         */
        handlePayTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.payTypeName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.payTypeCode) })

            this.basicDataForm.payTypeId = uidArr.join(',')
            this.basicDataForm.payTypeInput = nameArr.join(',')

        },
        /**
         * @function handlePayTypeCounterUseCallBack - （自定义营销）支付方式柜台使用回调处理函数
         */
        handlePayTypeCounterUseCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.payTypeName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.payTypeCode) })

            this.basicDataForm.payTypeCode86.value = uidArr.join(',')
            this.basicDataForm.payTypeCode86.text = nameArr.join(',')

        },
        /**
         * @function payTypeClick - 支付方式
         */
        // payTypeClick() {
        //     console.log('here')
        //     this.$refs.payType.handleDialogVisible(true);
        // },
        /**
         * @function handlePayTypeBack - 支付方式回调处理函数
         */
        // handlePayTypeBack(data) {
        //     console.log(data);
        // },
        //-------------------------------票券---------------------------------------------
        /**
         * @function couponBatchClick - 票券批次点击
         */
        couponBatchClick(couponBatchDialog) {
            this.$refs[`${couponBatchDialog}`].openDialog(true);
        },
        /**
         * @function handleCouponBatchCallBack - （自定义营销）票券批次回调处理函数
         */
        handleCouponBatchCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.couponName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.applyCode) })

            this.basicDataForm.giftTicket.couponApplyCode3.value = uidArr.join(',')
            this.basicDataForm.giftTicket.couponApplyCode3.text = nameArr.join(',')
        },
        /**
         * @function handleGiftCouponBatchCallBack - （giftTicketsActivity）票券批次回调处理函数
         */
        handleGiftCouponBatchCallBack(data) {
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.couponName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.applyCode) })

            this.basicDataForm.giftTicketId = uidArr.join(',')
            this.basicDataForm.giftTicketInput = nameArr.join(',')
        }


    }
};

export default alertHandle;