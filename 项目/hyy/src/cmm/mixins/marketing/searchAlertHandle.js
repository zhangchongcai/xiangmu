// 支付方式
import cinemaDialog from "cmm/dialogs/cinema/cinemaDialog.vue"; //影院弹窗
import userDialog from "cmm/dialogs/user/userDialog.vue"; //用户弹窗
import orgStructureDialog from "cmm/dialogs/orgStructure/orgStructureSingleDialog.vue"; //组织结构单个节点多选弹窗



/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件 
 */
let alertHandle = {
    components: {
        cinemaDialog,
        userDialog,
        orgStructureDialog
    },
    data() {
        return {
            reviewData: {

            },
            altertKeysFn: {
                cinemaDialog: 'cinemaClick',
                userApprovalDialog: 'userApprovalClick',
                userCreaterDialog: 'userCreaterClick',
                orgStructureDialog: 'orgStructureClick'
            },
            //组织结构弹窗
            orgStructureDialog: {
                orgStructureDialogVisible: false,
                title: "选择组织结构",
            },
            //影院弹窗
            cinemaDialog: {
                cinemaDialogVisible: false,
                title: "选择适用影院",
            },
            //审批人用户弹窗
            userApprovalDialog: {
                userApprovalDialogVisible: false,
                title: "选择审批人",
            },
            //创建人用户弹窗
            userCreaterDialog: {
                userCreaterDialogVisible: false,
                title: "选择创建人",
            }

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

        },
        /**
         * @function handleMerchant - 交易商户回调处理函数
         */
        handleMerchant(data) {

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
         * @function filmClick - 选择影片
         */
        filmClick() {},
        /**
         * @function 
         */
        handleFilm(data) {
            console.log(data);
        },
        /**
         * @function filmTypeClick - 选择影片类型
         */
        filmTypeClick() {},
        /**
         * @function handleFilmType - 影片类型回调处理函数
         */
        handleFilmType() {},
        /**
         * @function tradeNameClick - 选择商品名称
         */
        tradeNameClick() {

        },
        /**
         * @function handleTradeName - 商品名称回调处理函数
         */
        handleTradeName(data) {
            console.log(data);
        },
        /**
         * @function goodsClick - 选择商品
         */
        goodsClick() {},
        /**
         * @function handleGoods - 商品回调处理函数
         */
        handleGoods(data) {
            console.log(data);
        },
        /**
         * @function membershipLevelClick - 选择会员等级
         */
        membershipLevelClick() {},
        /**
         * @function handleMembershipLevel - 会员等级回调处理函数
         */
        handleMembershipLevel() {

        },
        /**
         * @function payTypeClick - 支付方式
         */
        payTypeClick() {
            this.$refs.payType.handleDialogVisible(true);
        },
        /**
         * @function handlePayTypeBack - 支付方式回调处理函数
         */
        handlePayTypeBack(data) {
            console.log(data);
        },
        /**
         * @function multiCinemaClick - 
         */
        multiCinemaConfirmClick() {
            this.$refs.multiCinema.confirmData()
            this.$refs.multiCinema.framedialogVisible = false;
        },
        /**
         * @function multiCinemaClick - 
         */
        multiCinemaClick() {
            this.$refs.multiCinema.framedialogVisible = !this.$refs.multiCinema.framedialogVisible;

        },
        /**
         * @function cinemaClick - 点击打开影院弹窗
         */
        cinemaClick(reviewData) {
            // 回显
            let reviewList = []
            if (reviewData && reviewData.value && reviewData.text) {
                reviewData.value.split(',').map((item) => { reviewList.push({ code: item, name: "", reviewFlag: "review" }) });
                reviewData.text.split(',').map((item, index) => { reviewList[index].name = item });
            }
            console.log("reviewList", reviewList);
            // 开启弹窗
            this.$refs.cinemaDialog.openDialog(true, reviewList)
        },
        /**
         * @function handleCinemaBack - 影院弹窗回调
         */
        handleCinemaBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.name) })
            let uidArr = []
            data.map(item => { uidArr.push(item.code) });
            // this.baseConfig.form[`${this.currentInputName}`] = uidArr.join(',')
            // this.baseConfig.system.forEach(item => {
            //     if (item.keyName == this.currentInputName) {
            //         item.value = nameArr.join(',')
            //     }
            // })
            this.searchHeaderFormData.searchBusinessCode = nameArr.join(',')
            this.searchHeaderDialogData.searchBusinessCode = uidArr.join(',')
        },
        /**
         * @function userCreaterClick - 点击打开创建人用户弹窗
         */
        userCreaterClick(reviewData) {
            // 回显
            let reviewList = []
            if (reviewData && reviewData.value && reviewData.text) {
                reviewData.value.split(',').map((item) => { reviewList.push({ id: item, fullName: "", reviewFlag: "review" }) });
                reviewData.text.split(',').map((item, index) => { reviewList[index].fullName = item });
            }
            console.log("reviewList", reviewList);
            // 开启弹窗
            this.$refs.userCreaterDialog.openDialog(true, reviewList)
        },
        /**
         * @function handleUserCreaterBack - 创建人用户弹窗回调
         */
        handleUserCreaterBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.fullName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.id) });
            // this.baseConfig.form[`${this.currentInputName}`] = uidArr.join(',')
            // this.baseConfig.system.forEach(item => {
            //     if (item.keyName == this.currentInputName) {
            //         item.value = nameArr.join(',')
            //     }
            // })
            this.searchHeaderFormData.searchCreaterId = nameArr.join(',')
            this.searchHeaderDialogData.searchCreaterId = uidArr.join(',')
        },
        /**
         * @function userApprovalClick - 点击打开审批人用户弹窗
         */
        userApprovalClick(reviewData) {
            // 回显
            let reviewList = []
            if (reviewData && reviewData.value && reviewData.text) {
                reviewData.value.split(',').map((item) => { reviewList.push({ id: item, fullName: "", reviewFlag: "review" }) });
                reviewData.text.split(',').map((item, index) => { reviewList[index].fullName = item });
            }
            console.log("reviewList", reviewList);
            // 开启弹窗
            this.$refs.userApprovalDialog.openDialog(true, reviewList)
        },
        /**
         * @function handleUserApprovalBack - 审批人用户弹窗回调
         */
        handleUserApprovalBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.fullName) })
            let uidArr = []
            data.map(item => { uidArr.push(item.id) });
            // this.baseConfig.form[`${this.currentInputName}`] = uidArr.join(',')
            // this.baseConfig.system.forEach(item => {
            //     if (item.keyName == this.currentInputName) {
            //         item.value = nameArr.join(',')
            //     }
            // })
            this.searchHeaderFormData.searchApprovalmanId = nameArr.join(',')
            this.searchHeaderDialogData.searchApprovalmanId = uidArr.join(',')

        },
        /**
         * @function orgStructureClick - 点击打开组织结构弹窗
         */
        orgStructureClick(reviewData) {
            // 回显
            let reviewList = []
            if (reviewData && reviewData.value) {
                reviewList = reviewData.value.split(',')
            }
            console.log("reviewList", reviewList);
            // 开启弹窗
            this.$refs.orgStructureDialog.openDialog(true, reviewList)
        },
        /**
         * @function handleOrgStructureBack - 组织结构弹窗回调
         */
        handleOrgStructureBack(data) {
            console.log(data);
            let nameArr = []
            data.map(item => { nameArr.push(item.text) })
            let uidArr = []
            data.map(item => { uidArr.push(item.id) });
            // this.baseConfig.form[`${this.currentInputName}`] = uidArr.join(',')
            // this.baseConfig.system.forEach(item => {
            //     if (item.keyName == this.currentInputName) {
            //         item.value = nameArr.join(',')
            //     }
            // })
            this.searchHeaderFormData.searchCreaterArea = nameArr.join(',')
            this.searchHeaderDialogData.searchCreaterArea = uidArr.join(',')
        }

    }
};

export default alertHandle;