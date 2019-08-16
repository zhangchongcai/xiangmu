<template>
    <div class="sell-goods">
        <nav class="nav-header" v-clickoutside="handlerOutside">
            <div class="nav-warp">
                <div class="carousel-container"  ref="navScroll" >
                    <ul class="carousel" ref="carousel">
                        <li v-for="(item,ind) in data" :key="ind" :class='["carousel-item",ind==oneMenu? "oneMenue_activ" : ""]' @click="handlerOnemenu(ind,item)">
                            {{item.name}}
                            <span class="el-icon-arrow-down el-icon--right" v-show="ind==oneMenu && data[oneMenu].children.length"></span>   
                        </li>
                    </ul>
                </div>
                <div class="control-btn">
                    <el-button plain class="el-icon-arrow-left"  size="medium" :disabled="scroll && scroll.x==0" @click="navChange(true)"></el-button>
                    <el-button plain class="el-icon-arrow-right" size="medium" :disabled="scroll && scroll.x == scroll.maxScrollX"  @click="navChange(false)"></el-button>
                </div>
            </div>
            <div class="two-nav" v-if="towMenuShow && data[oneMenu].children.length" >
                <div class="nav-warp">
                    <div class="carousel-container" ref="twoNavScroll">
                        <ul class="carousel" ref="carouselSed">
                            <li v-for="(item,ind) in data[oneMenu].children" :key="ind" :class='["carousel-item",ind==towMenuSele? "tow-active" : ""]' @click="handlerTwomenu(ind,item)">
                                <span class="el-dropdown-link" v-if="item.children.length == 0">
                                    {{item.name}}<i class="el-icon-arrow-down el-icon--right" v-show="ind==towMenuSele && item.children.length"></i>
                                </span>
                                <el-dropdown trigger="click"  @command="handleDropdwon" v-else>
                                    <span class="el-dropdown-link" >
                                        {{item.name}}<i class="el-icon-arrow-down el-icon--right" v-show="ind==towMenuSele"></i>
                                    </span>
                                    <el-dropdown-menu   slot="dropdown" style="width:13.3vw;text-align:center;font-size:1.2vw;margin-top:-0px">
                                        <el-dropdown-item  
                                        v-for="(subItem,subIndex) in item.children" 
                                        :key="subIndex"
                                        :command="subItem" style="font-size:1.2vw">{{subItem.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </li>
                        </ul>
                    </div>
                    <div class="btn">
                        <el-button plain class="el-icon-arrow-left nav-button"   :disabled="twoScroll && twoScroll.x == 0" @click="handleCarouselSed(true)"></el-button>
                        <el-button plain class="el-icon-arrow-right nav-button"  :disabled="twoScroll && twoScroll.x == twoScroll.maxScrollX"  @click="handleCarouselSed(false)"></el-button>
                    </div>
                </div>
            </div>
        </nav>
        <main class="main">
            <div class="content">
                <div class="breadcrumb">
                    <div>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item  
                            v-for="(item,index) in breadcrumbArr"
                            :key="index" >
                            <span :class="index == breadcrumbArr.length-1 ? 'last-breadcrumb':''">{{item}}</span> 
                            </el-breadcrumb-item>

                        </el-breadcrumb>
                    </div>
                    <div class="modul-warp">
                        <div class="modul">
                            <div :class='isFont?"":"active"' @click="modulChange(false)">图片模式</div>
                            <div :class='isFont?"active":""'  @click="modulChange(true)">文字模式</div>
                        </div>
                    </div>
                </div>
                <ul class="good-list"
                v-loading="loading">
                    <li :class='["good-item"+ind,"good-item",
                    item.soleUid === isSelectGoods?"border":"",
                    item.saleStatus?"":"disabled"]'
                    :style="goodListsale?'width:15.7vw':''" 
                    @click="addCart('good-item'+ind,item)"
                    v-for="(item,ind) in listData" 
                    ref="goodsItem"
                    :key="ind" 
                    >
                        <div class="good-img" v-show="!isFont" >
                            <img :src="item.imgUrl" alt="" v-if="item.imgUrl">
                            <div v-else  :style="{width:'100%',height:'100%'}"></div>
                        </div>
                        <div :class='["introduce",item.soleUid === isSelectGoods?"isSelectGoods":""]' :style="!isFont?'border-top:none':''">
                            <p class>{{item.aliasName ?item.aliasName:[1,3,5].includes(item.merType) ? item.skuSellEntity.name:
                                item.merType==2 ? item.name+'/'+ item.skuSellEntity.name : item.name}}</p>
                            <p class>¥{{[1,2,3,5].includes(item.merType)?item.skuSellEntity.price:item.price}}</p>
                        </div>
                    </li>
                </ul>

                <div class="footer">
                    <span class="totall">总计：{{totalNum}}件商品</span>
                    <div class="pagation" >
                        <template v-if="listData.length">
                            <el-button plain class="el-icon-arrow-left nav-button"   :disabled="currentPage==1"  @click="pagination('pre')"></el-button>
                            <span>{{currentPage}}/{{Math.ceil(totalNum/pageSize)}}</span>
                            <el-button plain class="el-icon-arrow-right nav-button"   :disabled="currentPage==Math.ceil(totalNum/pageSize)"  @click="pagination('next')"></el-button>
                        </template>
                    </div>
                    
                </div>
            </div>
            <!-- 购物车 -->
            <div class="aside" ref="cart">
                <Cart @handerDetail="handerDetail"></Cart>
            </div>
        </main>
        <!-- 底部Tab -->
        <SearchpayWaydetlTab v-on:handerDetail="handerDetail"></SearchpayWaydetlTab>
        <!-- 更多支付 -->
        <MorePay :list="dialogList"  ref="moreDialog" v-on:selecDialogItem="selecDialogItem"></MorePay>
        <!-- 更多票类 -->
        <ticketsChanging v-if="changingTicket"></ticketsChanging>
        <!-- 换卖品 -->
        <ReplaceGoods></ReplaceGoods>
        <!-- 支付弹窗 -->
        <settlement-window></settlement-window>
        <!-- 键盘 -->
        <KeyNumberBoard></KeyNumberBoard>
    </div>
</template>
<script>
import Cart from "src/components/cart/layout"
import SearchpayWaydetlTab from 'src/components/paytab'
import MorePay from 'src/components/dialog/MorePay'
import ticketsChanging from 'src/components/ticketsChanging'
import ReplaceGoods from 'src/components/dialog/ReplaceGoods'
import KeyNumberBoard from 'components/dialog/CartNumberKeyBoard'
import SettlementWindow from 'components/settlement/SettlementWindow'
import BScroll from 'better-scroll'
import {mapGetters,mapMutations,mapState,mapActions} from 'vuex'
import {SHOW_MORE_TICKETS,GET_CART_BILLCODE,CART_SET_GOODS_DATA,GET_KIND_PRICE,GET_CART_DATA,GET_CART_BILLCODEUID,CART_SEARCH_GOODS_TEXT,ACTION_CART_ADD_CART,ACTION_CART_INIT_CART,CART_FIND_CART_DATA} from 'types'
import { VM_ON_GOODS_SEACH } from 'types/vmOnType.js'
import { productExhibitionClassIfy, productExhibitionHomeDefault,addCart,initCart,findCart,productExhibitionGetProductByCode} from 'http/apis'
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};
export default {
    components: { Cart ,SearchpayWaydetlTab,MorePay,ReplaceGoods, KeyNumberBoard,SettlementWindow, ticketsChanging},
    directives: {clickoutside},
    data() {
        return {
            sellList: [
                { titile: "商品热卖" },
                { titile: "商品热卖" },
                { titile: "商品热卖" },
                { titile: "商品热卖" }
            ],
            //是否文字模式
            isFont: true,
            //是否显示购物车
            cartIsshow:true,
            goodListsale:true,

            //菜单长度
            OnemenuLength:'',
            TwomenuLength:'',

            //一级菜单
            oneMenu:0,
            //二级菜单显示
            towMenuShow:false,
            towMenuSele:null,
            //被选中商品
            
            leftDisabled: false,
            rightDisabled: true,

            sedLeftDisabled: false,
            sedRightDisabled: true,

            listData:[],
            currentPage:1,
            isSelectGoods: '',
            //换票类
            dialogList:[],
            data:[],
            scroll:null,
            twoScroll:null,
            navUid:'',
            breadcrumbArr:['常用商品'],
            totalNum:0,
            loading:false,
            searchGoodsText:'',
        };
    },
    
    computed: {
        
        ...mapGetters([
            'changingTicket',
            'billCode',
            'channelCode',
            'cinemaName',
            'cinemaCode',
            'cinemaUid',
            'channelCode',
            'terminalId',
            'terminalCode',
        ]),
        pageSize(){
            if(this.isFont && this.goodListsale) return 6*7
            if(this.isFont && !this.goodListsale) return 4*7
            if(!this.isFont && this.goodListsale) return 6*2
            if(!this.isFont && !this.goodListsale) return 4*2
        },
    },
    async mounted() {
        this.getNavData()
        this.getListData()
        this.scroll = new BScroll(this.$refs.navScroll,{
            scrollY:false,
            scrollX:true,
            click:true,
        })
        this.$vm.$on(VM_ON_GOODS_SEACH,(data)=>{
            this.searchGoodsText = data;
            if(!data) return
            this.currentPage = 1;
            this.getListDataByCode()
        })
    },
    beforeDestroy(){
        this.$vm.$off(VM_ON_GOODS_SEACH)
    },
    methods: {
        ...mapMutations({
            GET_CART_BILLCODE,
            CART_SET_GOODS_DATA,
            GET_KIND_PRICE,
            GET_CART_DATA,
            GET_CART_BILLCODEUID,
            CART_SEARCH_GOODS_TEXT
        }),
        ...mapActions([
            ACTION_CART_ADD_CART,
            ACTION_CART_INIT_CART,
            CART_FIND_CART_DATA
        ]),
        navChange(type){
            if(type){
                this.scroll.scrollBy(window.innerWidth*(11.7/100),0,300)
            }else{
                this.scroll.scrollBy(-(window.innerWidth*(11.7/100)),0,300)
            }
        },
        async initCart(){
            const data = await initCart({
                netSaleFlag:'0',
                remark:'一些说明',
            })
            if(data.code == 200){
                this[GET_CART_BILLCODE](data.data)
            }
        },
        async addCart(event,item){
            if(!item.saleStatus) return;
            if(!this.billCode){
                // await this.initCart()
                await this[ACTION_CART_INIT_CART]()
            }
            this.SelectIntroduce(event,item)
        },
        handleCarouselSed(isLeft) {
            // let width =Number(13.3);
            if(isLeft){
                this.twoScroll.scrollTo(this.twoScroll.x+window.innerWidth*(13.3/100),0)
            }else{
                this.twoScroll.scrollTo(this.twoScroll.x + -(window.innerWidth*(13.3/100)),0)
            }
        },
        //图片、文字模式
        modulChange(modul) {
            this.isFont = modul;
        },
        async SelectIntroduce(event,dataItem) {

            console.log(dataItem)
            this.loading = true 
            const data = await this[ACTION_CART_ADD_CART](dataItem)
             this.loading = false
            if(data.code != 200) return 
            this[CART_FIND_CART_DATA]();
            // this.controllPath(event)
            this.isSelectGoods = dataItem.soleUid;
            setTimeout(()=>{
               this.isSelectGoods = '' 
            },300)
        },
        specialGoodMap(mapItem,parentMerUid,type){//组合 合成品，套餐对象.
            let subObj = {};
            subObj.brandUid = mapItem.brandUid;
            subObj.merCode = mapItem.merCode;
            subObj.merName = mapItem.merName;
            subObj.merType = mapItem.merType;
            subObj.origenalPrice = mapItem.price;
            subObj.salePrice = mapItem.price;
            subObj.skuCode = mapItem.skuCode;
            subObj.skuUid =  type!=4 ? mapItem.skuUid:mapItem.skuSellEntity.skuUid;
            subObj.unitUid = mapItem.unitUid;
            subObj.parentMerUid = parentMerUid;
            subObj.merSpec = mapItem.merSpec;
            subObj.merUid = mapItem.merUid;
            subObj.needCount = mapItem.merCount;
            if(subObj.merType == 5){
                subObj.needCount = mapItem.needCount;
                subObj.rateAmount = mapItem.rateAmount;
                subObj.parentSkuUid = mapItem.parentSkuUid;
            }
            return subObj;
        },
        //一级菜单
        handlerOnemenu(ind,obj) {
            this.oneMenu = ind;
            this.towMenuShow = true;
            this.$nextTick(()=>{
                if(this.data[this.oneMenu].children.length){
                    this.twoScroll = new BScroll(this.$refs.twoNavScroll,{
                        scrollY:false,
                        scrollX:true,
                        click:true,
                    })
                }
            })
            this.navUid = obj.uid
            this.breadcrumbArr = [obj.name]
        },
        //二级菜单
        handlerTwomenu(ind,obj) {
            this.towMenuSele = ind;
            this.navUid = obj.uid
            this.breadcrumbArr = [this.breadcrumbArr[0],obj.name]
        }, 
        handlerOutside() {
            this.towMenuShow = false;
            this.towMenuSele = null;
        },
        handleDropdwon(command) {
            this.navUid = command.uid;
            this.breadcrumbArr = [...this.breadcrumbArr,command.name]
        },
        //点击伸缩购物车
        handerDetail() {
            this.cartIsshow = !this.cartIsshow;
            if(this.cartIsshow) {
                this.$refs.cart.style.transform = 'translateY(100vh)'
                setTimeout(_=>{
                    this.$refs.cart.style.width=0;
                    this.goodListsale = true;
                },300)
            }else{
                this.$refs.cart.style.width='37.3%';
                this.goodListsale = false;
                setTimeout(_=> {
                    this.$refs.cart.style.transform = 'translateY(0)'
                },300)
            }
            
        },
        //分页
        pagination(type) {
            if(type == 'next'){
                this.currentPage++
                this.getListData();
            }else{
                this.currentPage--;
                this.getListData()
            }
        } ,
        selecDialogItem(item) {
            console.log(item)
        },
        changeData(obj,arr,showTopArr){ //递归重组后台返回的菜单树
            if(obj.size){
                for(let i = 0 ; i < obj.list.length ; i++){
                    let item = obj.list[i]
                        let dataObj = {
                            name: item.name,
                            parentUid: item.parentUid,
                            isLeaf: item.isLeaf,
                            seq: item.seq,
                            uid:item.uid,
                            children:[]
                        }
                        if(showTopArr) if(item.showTop) showTopArr.push(item)
                        arr.push(dataObj)
                        this.changeData(obj.list[i].children,arr[i].children,showTopArr) 
                    
                    
                }
            }
        },
        async getNavData(){
            const data = await productExhibitionClassIfy({
                cinemaUid:this.cinemaUid,
                terminalId:this.terminalId
            }) 
            
            let arr = [];
            let newObj = {
                list:[],
                size:0
            }
            // let newArr = [];
            let showData = [];
            if(data.data){
                this.changeData(data.data.children,arr,newObj.list)
                // arr = data.data
                newObj.size = newObj.list.length
                this.changeData(newObj,showData)
            }
            showData.unshift({
                name:'常用商品',
                uid:'',
                children:[],
            })
            this.data = showData;
        },
        async getListData(){
            const data = await productExhibitionHomeDefault({
                cinemaUid:this.cinemaUid,
                terminalCode:this.terminalId,
                categoryUid:this.navUid,
                pageSize:this.pageSize,
                currentPage : this.currentPage,
            })
            if(data.code != 200) return this.$message.error(data.msg)
            this.listData = data.data.data;
            this.currentPage = data.data.currentPage;
            this.totalNum = data.data.totalNum;
        },
        async getListDataByCode(){
            const data = await productExhibitionGetProductByCode({
                cinemaUid:this.cinemaUid,
                terminalCode:this.terminalId,
                code:this.searchGoodsText,
                pageSize:this.pageSize,
                currentPage : this.currentPage,
            })
            if(data.code != 200 ) return this.$message.error(data.msg)
            if(!data.data || !data.data.data.length) return this.$message.warning('暂无商品！')
            if(data.data.data.length == 1){
                this.searchGoodsText = '';
                this.addCart(null,data.data.data[0])
                return
            }
            
            this.listData = data.data.data;
            this.currentPage = data.data.currentPage;
            this.totalNum = data.data.totalNum;
        },
    // controllPath(addBtn, shopCar='detail-menu') {
    //     var addBtnDom = null,
    //         shopCarDom = null;
    //     if(typeof addBtn === "string"){
    //     addBtnDom = document.querySelector('.'+addBtn);
    //     } else if(addBtn instanceof HTMLElement){
    //         addBtnDom = addBtn
    //     } else {
    //         alert("传入的参数错误： 第一个参数应为增加按钮的dom元素或该元素的选择器。");
    //         return;
    //     }

    //     if(typeof shopCar === "string"){
    //         shopCarDom = document.querySelector('.'+shopCar);
    //     } else if(shopCar instanceof HTMLElement){
    //         shopCarDom = shopCar;
    //     }else {
    //         alert("传入的参数错误： 第二个参数应为购物车的dom元素或该元素的选择器。");
    //         return;
    //     }

    //     // 获取两个dom的位置
    //     var addBtnposition = addBtnDom.getBoundingClientRect();
    //     var shopCarPosition = shopCarDom.getBoundingClientRect();
    //     var addBtnCenterX = (addBtnposition.left + addBtnposition.right) / 2;
    //     var addBtnCenterY = (addBtnposition.top + addBtnposition.bottom) / 2;
    //     var shopCarCenterX = (shopCarPosition.left + shopCarPosition.right) / 2;
    //     var shopCarCenterY = (shopCarPosition.top + shopCarPosition.bottom) / 2;
    //     //计算增加按钮 是在 相对于购物车的 左边还是右边（用于控制后面的移动方向）
    //     var relativePosition = addBtnCenterX > shopCarCenterX ? -1 : 1;

    //     // 获取连个dom之间的距离
    //     var xDistance = Math.abs(addBtnCenterX - shopCarCenterX);
    //     var yDistance = Math.abs(addBtnCenterY - shopCarCenterY);

    //     // 绘制小球并设置其位置
    //     var ballDom = this.drawBall();
    //     ballDom.style.top = addBtnCenterY + "px";
    //     ballDom.style.left = addBtnCenterX + "px";
    //     document.body.appendChild(ballDom);
    //     /*
    //     * 根据一元二次方程的轨迹求出对象的系数 y = ax^2 + bx + c
    //     *  var coefficientC = 0;
    //     *  var coefficientB = 0;
    //     *  var coefficientA = yDistance / Math.pow(xDistance, 2);
    //     */
    //     //小球的横竖坐标
    //     var xAbscissa = 0, yAbscissa = 0;

    //     //设置移动路径
    //     var ballTimer = setInterval(function () {
    //         //每次重新坐标
    //         xAbscissa += 5 * relativePosition;
    //         yAbscissa = (yDistance / Math.pow(xDistance, 2)) * Math.pow(xAbscissa, 2);
    //         ballDom.style.top = addBtnCenterY + yAbscissa + "px";
    //         ballDom.style.left = addBtnCenterX + xAbscissa + "px";
    //         //检查是否到达终点
    //         var surplusDistance = parseInt(ballDom.style.left) - shopCarCenterX;
    //         if (Math.abs(surplusDistance) <= 5) {
    //             clearInterval(ballTimer);
    //             document.body.removeChild(ballDom)
                
    //         }
    //     }, 5);
    // },
    // drawBall() {
    //     var ballDom = document.createElement("div");
    //     ballDom.style.width = "30px";
    //     ballDom.style.height = "30px";
    //     ballDom.style.border = "1px solid #3b74ff";
    //     ballDom.style.background = "#3b74ff";
    //     ballDom.style.borderRadius = "50%";
    //     ballDom.style.position = "absolute";
    //     ballDom.style.zIndex = '10000' 
    //     return ballDom;
    // },


        
    },
    created() {
        
    },
    
    watch:{
        pageSize(){
            this.currentPage = 1;
            if(this.searchGoodsText){
                this.getListDataByCode()
            }else{
                this.getListData();
            }
            
        },
        navUid(){
            this.currentPage = 1;
            this[CART_SEARCH_GOODS_TEXT]('')
            this.getListData()
        },
    }
};
</script>
<style lang="scss" >
#aa {
    line-height: 100px;
    .bbb {
    display: inline-block;
    white-space: nowrap;
    }
}
.sell-goods {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    overflow: hidden;
    .nav-header {
        position: relative;
        height: 6.3vh;
        line-height: 6.3vh;
        width: 100%;
        @include bg_color($background-color-theme);
        & > .nav-warp {
            position: relative;
            margin: 0 auto;
            height: 100%;
            display: flex;
            align-items: flex-end;
            .control-btn{
                margin-left: 1vw;
                display: inline-flex;
                flex-wrap: nowrap;
                height: 80%;
                align-items: center;
                .el-button{
                        text-align: center;
                        background: #F2F4FD;
                        width: 3.5vw;
                        height: 3.9vh;
                        margin: 0;
                        padding: 0;
                        font-size: $font-size14;
                        margin-right: 2%;
                    }
            }
            & > .carousel-container {
                overflow: hidden;
                // max-width: 81.9vw;
                width: 81.9vw;
                height: 4.7vh;
                margin-left: 1.8vw ;
                padding-top: .8vh;
                .carousel {
                    height: 100%;
                    line-height: 100%;
                    white-space: nowrap;
                    display: inline-block;
                    vertical-align: top;
                    .carousel-item {
                        display: inline-block;
                        width: 11.3vw;
                        height: 100%;
                        line-height: 4.7vh;
                        font-size: $font-size12;
                        border-top-left-radius: 4px;
                        border-top-right-radius: 4px;
                        background: #e4e7f6;
                        margin-left: .4vw;
                        text-align: center;
                    }
                    .oneMenue_activ{
                        background: #FFFFFF;
                    }
                }
            }
        }
        .two-nav {
            position: absolute;
            height: 5.2vh;
            left: 0;
            right: 0;
            bottom: -4.3vh;
            line-height: 5.2vh;
            z-index: 99;
            background: #e4e7f6;
            .nav-warp {
                display: flex;
                height: 100%;
                box-shadow: 0px 4px 5px rgba(0,0,0,0.2);
                .carousel-container {
                    margin: 0 auto;
                    height: 100%;
                    overflow: hidden;
                    flex:1;
                    background: #fff;
                    .carousel {
                        display: inline-block;
                        white-space: nowrap;
                        transition: transform 1s;
                        background: #fff;
                        .carousel-item {
                            position: relative;
                            width: 13.3vw;                            
                            display: inline-block;
                            text-align: center;
                            .el-dropdown {
                                width: 13.3vw;                               
                                top: 0;
                            }
                        }
                    }
                }
                .btn {
                    display: flex;
                    width: 7vw;
                    .el-button{
                        background: #F2F4FD;
                        box-sizing: border-box;
                        border: none;
                        border-radius: 0;
                        width: 3.5vw;
                        height: 5.2vh;
                        margin: 0;
                        padding: 0;
                        font-size: $font-size14;
                    }
                    span {
                        flex:1;
                        font-size: 2vw;
                        line-height: 5.2vh;
                        text-align: center;
                        background: #F2F4FD;
                        cursor: pointer;
                    }
                }
            }
            .el-dropdown-link{
                display: inline-block;
                font-size: $font-size12;
                width: 100%;
                height: 100%;
            }
            .tow-active{
                background: #D9E4FF;
            }
        }
    }
    .main {
        display: flex;
        width: 100%;
        height: calc(100vh - 6.3vh - 2.3vh - 5.2vh - 6.3vh  - 0.3vh);
        background: #fff;
        .content {
            flex: 1;
            height: 100%;
            .breadcrumb {
                display: flex;
                height: 7vh;
                & > div {
                    flex: 1;
                }
                .el-breadcrumb {
                    flex: 1;  
                    padding: 20px 10px;
                    span{
                        font-size: $font-size12;
                    }
                    .last-breadcrumb{
                        @include font_color($btn-background-color-theme);
                    } 
                }
                .modul {
                    box-sizing: border-box;
                    display: flex;
                    width: 14.5vw;
                    height: 3.6vh;
                    line-height: 3.6vh;
                    color: #3b74ff;
                    font-size: 12px;
                    text-align: center;
                    border: 1px solid #3b74ff;
                    border-radius: 2px;
                    float: right;
                    margin: 11px 1.3vw;
                    & > div {
                        flex: 1;
                        font-size: 1.2vw;
                        transition: all 0.3s;

                    }
                    .active {
                        background: #3b74ff;
                        color: #ffffff;
                    }
                }
            }
            .good-list {
                box-sizing: border-box;
                flex-wrap: wrap;
                padding-top: 1px;
                padding-left: 1.5%;
                overflow: auto;
                width: 100%;
                height:calc(100% - 7vh - 10vh) ;
                cursor:pointer;
                .border {
                    box-shadow: 0 0 0 1px $btn-background-color-theme;
                }
                .good-item {
                    position: relative;
                    box-sizing: border-box;
                    display: inline-block;
                    flex-direction: column;
                    transition: all .3s;
                    width: 24%;
                    margin-bottom: 1vh;
                    margin-left: .5%;
                    border-radius: 4px;
                    z-index: 99;
                    color:#a7b8e4;
                    .good-img {
                        box-sizing: border-box;
                        width: 100%;
                        height: 19vh;
                        border: 1px solid;
                        border-radius: 4px 4px 0 0;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 4px;
                        }
                    }
                    .introduce {
                        display: inline-flex;
                        box-sizing: border-box;
                        flex-direction: column;
                        width: 100%;
                        height: 7.8vh;
                        border: 1px solid #a7b8e4;
                        border-radius: 0 0 4px 4px;
                        transition: all 0.3s;
                        & > p {
                            flex: 1;
                            text-align: center;
                            height: 3.9vh;
                            line-height: 3.9vh;
                        }
                        & > p:nth-child(1) {
                            font-family: MicrosoftYaHei-Bold;
                            font-size: $font-size12;
                            color: #333333;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        & > p:nth-child(2) {
                            font-family: Arial-BoldMT;
                            font-size: $font-size14;
                            color: #fe825e;
                        }
                    }
                    .isSelectGoods {
                        background: #3b74ff;
                        border-color: #3b74ff;
                        p {
                            color: #ffffff !important;
                        }
                    }
                }
                .disabled{
                    background: rgb(242,242,242);
                    cursor: not-allowed;
                    color:#BCBCBC!important;
                    .introduce {
                        border-color:#BCBCBC;
                        p{
                            color:#666!important;
                        }
                        
                    }
                }
            }
            .footer{
                box-sizing: border-box;
                display: flex;
                text-align:right;
                line-height: 3vh;
                padding: 2%;
                span{font-size: $font-size12;}    
                .pagation{
                    display: flex;
                    justify-content:space-between;
                    width: 30%;
                    margin: 0 auto;
                    .pagebtn{
                        width: 6.3vw;
                        text-align: center;
                        border: #3b74ff 1px solid;
                        border-radius: 2px;
                        font-size: $font-size12;
                        color: #3b74ff;
                        &:active{
                            background: #3b74ff;
                            color: #ffffff
                        }
                    }
                }

            }
        }
        .aside {
            width: 0;
            margin-top: 10px;
            transition: all .3s;
            transform: translateY(100vh)
        }
    }
}
</style>


