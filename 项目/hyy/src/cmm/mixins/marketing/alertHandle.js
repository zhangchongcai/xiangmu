// 支付方式
import payType from 'csm/components/payType/PayType.vue';
import multiCinema from 'frame_cpm/components/frameadmin/cinemaDialog/multiCinema2.vue';
import SelBrand from "cmm/dialogs/SelectBrand";  //品牌弹窗
import selectedGoods from  'cmm/dialogs/SelectedGoods' //选择商品
import MerClass from 'cmm/dialogs/MerClassDialog' //选择类别

/**
 * @mixin alertHandle - 注册弹窗，处理弹窗回调
 * @description 在修改此对象已存在的方法时需要注意，可能同时需要修改每个组件 
 */
let alertHandle = {
    components: {
        payType,
        multiCinema,
        SelBrand,
        selectedGoods,
        MerClass
    },
    data() {
        return {
            // 品牌弹窗
            brandQueryData: {
                list: {
                    id: ""
                }
            },
            //选择商品
            selectedGoodsDialogVisible:false,//必填显隐控制
            dialogFeedbackData:'',//可选，回选数组，不传为不回选
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
            console.log(data);
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
         * @function selectBrand  -选择品牌选择
         */
        selectBrand() {
            this.$refs.brand.brandhandleClose(true)
                // 调用子组件请求
            this.$refs.brand.init()
        },
        //-回调
        getBrandQueryData(val){
            this.basicDataForm.brandId40.value = val.list.id
            this.basicDataForm.brandId40.text = val.list.name
            console.log('这里获取品牌数据 ',val)
        },
        /**
         * @function selectBrand  -选择类别
         */
        selectType(data) {
            this.$refs.MerClassDialog.openMerClassTree()
            this.basicDataForm.classCode41.text = data.text;
        },
        //-回调
        selectMerClassData(data) {
            this.basicDataForm.classCode41.text = data.nameArr.join(',')
            this.basicDataForm.classCode41.value = data.uidArr.join(',')
        },
        /**
         * @function selectBrand  -选择商品名称 
         */
        selectGoodsName(data) {
            console.log(data)
            this.selectedGoodsDialogVisible = true
            this.basicDataForm.merKey46.text = data.text;
        },
        //-回调
        SelectedGoodsDialogCallBack(value){
            let nameArr = []
            value.data.map(item=>{nameArr.push(item.merName)})
            let uidArr=[]
            value.data.map(item=>{uidArr.push(item.uid)})
            this.basicDataForm.merKey46.value = uidArr.join(',')
            this.basicDataForm.merKey46.text = nameArr.join(',')
            console.log(value,'数据数据数据')
        },

        /**
         * @function handleFilmType - 影片类型回调处理函数
         */
        handleFilmType() {},
        /**
         * @function tradeNameClick - 选择商品名称
         * 
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
         * @function multiCinemaConfirmClick - 
         */
        multiCinemaConfirmClick() {
            console.log(this.$refs.multiCinema.confirmData)
            this.$refs.multiCinema.confirmData()
            this.$refs.multiCinema.framedialogVisible = false;


        },
        /**
         * @function multiCinemaClick - 
         */
        multiCinemaClick() {
            // this.$refs.multiCinema.handleDialogVisible(true);
            this.$refs.multiCinema.framedialogVisible = !this.$refs.multiCinema.framedialogVisible;

        },
        /**
         * @function handleMultiCinemaBack - 
         */
        handleMultiCinemaBack(data) {
            console.log(data);
        },
    }
};

export default alertHandle;