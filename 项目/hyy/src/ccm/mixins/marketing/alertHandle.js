import cinemaTreeDialog from "ccm/dialogs/treeCinema"; //影院包含组织节点弹窗
import cinemaSingleDialog from "ccm/dialogs/cinema" //影院单选
import cinemaMultipDialog from "cmm/dialogs/cinema/cinemaDialog"; //影院弹窗 多选
import projectionEffectDialog from "cmm/dialogs/projectionEffect/projectionEffectDialog" //影片效果
import tradeMerchantSingleDialog from 'ccm/dialogs/tradeMerchantSingle' //交易客商

import selectedBrandSingle from "ccm/dialogs/selectedBrandSingle"; //品牌弹窗
import selectedGoodsSingle from 'ccm/dialogs/selectedGoodsSingle' //选择商品
import merClassSingle from 'ccm/dialogs/merClassSingle' //选择类别

import filmDialog from "cmm/dialogs/film/filmDialog.vue"; //影片弹窗
import filmTypeDialog from "cmm/dialogs/filmType/filmTypeDialog.vue"; //影片类型弹窗
import cinemaTypeDialog from "cmm/dialogs/cinemaType/cinemaTypeDialog.vue"; //影院类型弹窗

import findStartNum from 'ccm/dialogs/findStartNum' //预生成编号弹窗


import crmMemberLevelDialog from "crm/dialogs/crmCardPolicy"; //会员等级
import crmCardPolicyDialog from "crm/dialogs/crmCardPolicy"; //会员卡政策

import tradeChannelDialog from 'cmm/dialogs/tradeChannel/tradeChannelDialog' //交易渠道

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
        findStartNum,
        projectionEffectDialog
    },
    data() {
        return {
            //选择会员等级弹窗传入参数
            reviewCrmMemberLevelData: [],
            crmMemberLevelDialogVisible: false, //选择会员等级弹窗状态
            crmMemberLevelDialogWhereUse: "", //选择会员弹窗引入标识

            //影院弹窗
            cinemaMultipDialog: {
                cinemaDialogVisible: false,
                title: "选择影院",
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
            //放映效果弹窗
            projectionEffectDialog: {
                projectionEffectDialogVisible: false,
                title: "选择放映效果",
            },
             //交易渠道弹窗
            tradeChannelDialog: {
                tradeChannelDialogVisible: false,
                title: "选择交易渠道",
            },
        }
    },
      

    methods: {
        /**
         * @function batchTicketIdsCallBack -预生成编号回调函数  
         * 
         */
        batchTicketIdsCallBack(data) {
            let valueArr = []
            data.forEach(item => {
                valueArr.push(item.id)
            })
            this.form.baseInfo.batchTicketIds.value = valueArr.join(',')
            console.log(this.form.baseInfo.batchTicketIds.value)
        },
        batchTicketIdsCancel() {
            if(!this.form.baseInfo.batchTicketIds.value){
                // this.form.baseInfo.couponGeneration.value = 0
                // console.log('this.form.baseInfo.couponGeneration.value',this.form.baseInfo.couponGeneration.value)
                this.form.baseInfo.couponGeneration.value = '0' 
            }
        },
        /**
         * 
         * @function {*}  影院范围多选  
         *
         */
        handleRegisterCinemaCallBack(data) {
            console.log('回调多选选影院',data)
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.id) })

            this.form.commonInfo.cinemarangev.value = uidArr.join(',')
            this.form.commonInfo.cinemarangev.text = nameArr.join(',')
        },
        /**
         * 
         * @function {*}  影院范围单选  
         *
         */
        cinemaSingleCallBack(data) {
            console.log('回调单选影院',data)
            this.form.commonInfo.cinemarangev.value = data.id
            this.form.commonInfo.cinemarangev.text = data.name
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
            data.data.map(item => { nameArr.push(item.cardName) })
            let uidArr = []
            data.data.map(item => { uidArr.push(item.id) })
                //会员等级回调处理

            this.form.commonInfo.consumerType.value = uidArr.join(',')
            this.form.commonInfo.consumerType.text = nameArr.join(',')

        },
        /**
         * @function handleProjectionEffectCallBack - 放映效果回调处理函数
         */
        handleProjectionEffectCallBack(data) {
            console.log(data);
            console.log(data)
            let nameArr = []
            data.map(item => { nameArr.push(item.propertyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.propertyCode) })

            this.addConfig.form.showEffectCode.value = uidArr.join(',')
            this.addConfig.form.showEffectCode.text = nameArr.join(',')

        },

        /**
         * @function handleStudioType - 影厅类型回调处理函数
         */
        handleStudioType(data) {
            console.log(data);
        },
        /**
         * @function cinemaTypeClick - 选择影厅类型
         */
        cinemaTypeClick() {
            this.$refs.cinemaTypeDialog.openDialog(true)
        },
        /**
         * @function handleFilmCallBack - 选择影厅类型回调
         */
        handleCinemaTypeCallBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.keyName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.keyCode) })
            this.addConfig.form.hallTypeKey.value  = uidArr.join(',')
            this.addConfig.form.hallTypeKey.text  = nameArr.join(',')
        },
        /**
         * @function cinemaClick - 选择影院
         */
        cinemaCallBack(data) {
            this.form.baseInfo.incomeCinemaId.value = data.id
            this.form.baseInfo.incomeCinemaId.text = data.text
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
            this.addConfig.form.uniformCode.value = uidArr.join(',')
            this.addConfig.form.uniformCode.text = nameArr.join(',')

        },
        /**
         * @function filmTypeClick - 选择影片类型
         */
        filmTypeClick() {
            this.$refs.filmTypeDialog.openDialog(true)
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
            this.addConfig.form.filmTypeKey.value  = uidArr.join(',')
            this.addConfig.form.filmTypeKey.text  = nameArr.join(',')
        },
        //-----------------------------------卖品类弹窗----------------------------------

        /**
         * @function selectBrand  -选择品牌选择
         */
        //-回调
        selectedBrandSingleCallBack(data) {
            console.log('品牌：',data)
            this.addConfig.form.brandName.value = data.uid
            this.addConfig.form.brandName.text = data.name

        },
        /**
         * @function selectType  -选择类别
         */
        //-回调
        merClassSingleCallBack(data) {
            this.addConfig.form.className.value = data.uid
            this.addConfig.form.className.text = data.name
            console.log('类别回调',data)
        },
        /**
         * @function selectBrand  -选择商品名称 
         */
        //-回调
        selectedGoodsSingleCallBack(data) {
            console.log('商品：',data)
            let value = data.skuUid? data.skuUid : data.uid
            // let test = data.skuName? `${data.merName}-${data.skuName}` :data.merName
            let test = data.skuName? `${data.skuName}` :data.merName
            // console.log('this.addConfig.options.exchange_goods',this.addConfig.options.exchange_goods)
            // this.addConfig.options.favourable_goods.merName.value = this.addConfig.options.exchange_goods.merName.value = value
            // this.addConfig.options.favourable_goods.merName.text = this.addConfig.options.exchange_goods.merName.text = data.merName
            this.addConfig.form.merName.value = value
            this.addConfig.form.merName.text = test

        },

        //-----------------------------交易类---------------------------------------
        /* 选择交易客商 */
        //回调
        tradeMerchantSingleCallBack(data) {
            console.log('交易客商', data)
            this.form.baseInfo.custId.text = data.name
            this.form.baseInfo.custId.value = data.id
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
            this.form.commonInfo.consumeWayCodeOp.text = textArr.join(",");
            this.form.commonInfo.consumeWayCodeOp.value = valueArr.join(',');
        },


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
};

export default alertHandle;