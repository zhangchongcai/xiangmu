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
                    <li :class='["good-item",ind==isSelectGoods?"border":""]'
                    :style="goodListsale?'width:15.7vw':''" 
                    @click="addCart($event,ind)"
                    v-for="(item,ind) in listData" 
                    ref="goodsItem"
                    :key="ind" 
                    >
                        <div class="good-img" v-show="!isFont" >
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div :class='["introduce",ind==isSelectGoods?"isSelectGoods":""]' :style="!isFont?'border-top:none':''">
                            <p class>{{[1,2,3].includes(item.merType)?item.skuSellEntity.name:item.name}}</p>
                            <p class>¥{{[1,2,3].includes(item.merType)?item.skuSellEntity.price:item.price}}</p>
                        </div>
                    </li>
                </ul>

                <div class="footer">
                    <div class="pagation" >
                        <template v-if="listData.length">
                            <el-button size="medium" :disabled="currentPage==1" @click="pagination('pre')"  class="pagebtn"><i class="iconfont iconzuojiantouda"></i> </el-button>
                            <span>{{currentPage}}/{{Math.ceil(totalNum/pageSize)}}</span>
                            <el-button size="medium" :disabled="currentPage==Math.ceil(totalNum/pageSize)"  @click="pagination('next')" class="pagebtn"><i class="iconfont iconyoujiantouda"></i> </el-button>
                        </template>
                    </div>
                    <span class="totall">总计：{{totalNum}}件商品</span>
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
import {mapGetters,mapMutations,mapState} from 'vuex'
import {SHOW_MORE_TICKETS,GET_CART_BILLCODE,CART_SET_GOODS_DATA,GET_KIND_PRICE,GET_CART_DATA,GET_CART_BILLCODEUID,CART_SEARCH_GOODS_TEXT} from 'types'
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
            oneMenu:null,
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
            isSelectGoods: 0,
            //换票类
            dialogList:[],
            data:[],
            scroll:null,
            twoScroll:null,
            navUid:'',
            breadcrumbArr:['全部'],
            totalNum:0,
            loading:false,
        };
    },
    computed: {
        ...mapState({
            searchGoodsText : state => state.cart.searchGoodsText
        }),
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
        }
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
        navChange(type){
            if(type){
                this.scroll.scrollTo(this.scroll.x+window.innerWidth*(11.7/100),0)
            }else{
                this.scroll.scrollTo(this.scroll.x + -(window.innerWidth*(11.7/100)),0)
            }
        },
        async initCart(){
            const data = await initCart({
                // channelCode:this.channelCode, //渠道编码	,
                // channelName:'132',//渠道名称
                // channelUid:'132',//渠道uid
                // cinemaCode:this.cinemaCode,//影院编码	
                // cinemaName:this.cinemaName,//影院名称
                // cinemaUid:'123456',//影院uid
                netSaleFlag:'0',
                remark:'一些说明',
            })
            if(data.code == 200){
                this[GET_CART_BILLCODE](data.data)
            }
        },
        async addCart(e,ind){
            if(!this.billCode){
                await this.initCart()
            }
            this.SelectIntroduce(e,ind)
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
        async SelectIntroduce(e,ind) {
            console.log(this.listData[ind])
            this.loading = true
            const item = this.listData[ind];
            let obj = {};
            
            obj.saleNum = 1;

            if([1,2].includes(item.merType)){
                obj.salePrice = item.skuSellEntity.price;
                obj.originalPrice = item.skuSellEntity.price;
            }else{
                obj.salePrice = item.price;
                obj.originalPrice = item.price;
            }
            obj.saleMer = {};
            
            obj.saleMer.brandUid = item.brandUid;
            obj.saleMer.merCode = item.code;
            obj.saleMer.merUid = item.merUid;
            obj.saleMer.merSpec = item.merSpec;
            obj.saleMer.merType = item.merType;
            obj.saleMer.merName = item.name;
            obj.saleMer.unitUid = item.unitUid;
            if(![3,4].includes(item.merType)){
                obj.saleMer.skuCode = item.skuSellEntity.code;
                obj.saleMer.skuUid = item.skuSellEntity.skuUid;
            }
            if(item.merType == 2){ //合成品
                obj.saleMer.merItemList = [];
                item.compoundList.map((mapItem)=>{
                    obj.saleMer.merItemList.push(this.specialGoodMap(mapItem,item.merUid));
                })
            }
            if(item.merType == 4){ //套餐
                obj.saleMer.merItemList = [];
                for(let i = 0; i< item.cinemaSetMealItemList.length;i++){
                    let mapItem = item.cinemaSetMealItemList[i]
                    obj.saleMer.merItemList.push(this.specialGoodMap(mapItem,item.merUid,item.merType));
                    if(mapItem.cinemaMakeItemEntityList){
                        mapItem.cinemaMakeItemEntityList.map((map)=>{
                            map.parentSkuUid = mapItem.skuSellEntity.skuUid
                            obj.saleMer.merItemList.push(this.specialGoodMap(map,mapItem.merUid,)); 
                        })
                    }
                }
            }
            const data = await addCart({
                billCode:this.billCode,
                merGoodsList:[obj],
                opType:'0'
            })
            this.loading = false;
            if(data.code != 200) return this.$message.error(data.msg);
            const cartData = await  findCart({
                billCode:this.billCode,
            })
            if(cartData.code != 200) return this.$message.error(cartData.msg);
            if(!cartData.data.goodsList) cartData.data.goodsList = [];
            this[CART_SET_GOODS_DATA](cartData.data.merGoodsList)
            this[GET_KIND_PRICE](cartData.data)
            this[GET_CART_DATA](cartData.data)
            this[GET_CART_BILLCODEUID](cartData.data.uid)
            this.isSelectGoods = ind;
            let span = document.createElement("span");
            span.className = "iconfont iconhuiyuan"
            span.style.position= 'absolute'
            span.style.transition = 'all 0.7s cubic-bezier(0.49, -0.29, 0.75, 0.41)';
            span.style.left = this.$refs.goodsItem[ind].getBoundingClientRect().left +this.$refs.goodsItem[ind].offsetWidth/2 +'px'
            span.style.top =  this.$refs.goodsItem[ind].getBoundingClientRect().top + this.$refs.goodsItem[ind].offsetHeight/2 + 'px'
            span.style.zIndex=99
            document.body.appendChild(span)
            let origin = document.querySelector("#origin");
            var x1 = span.getBoundingClientRect().left;
            var y1 = span.getBoundingClientRect().top;
            var x2 = origin.getBoundingClientRect().left;
            var y2 = origin.getBoundingClientRect().top;
            let maxX = x2 - x1 ;
            let maxY = y2 - y1 ;
            span.style.left = x1 + maxX + "px";
            span.style.top = y1 + maxY + "px";
            setTimeout(() => {
                document.body.removeChild(span)
            },700)
            
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
        changeData(obj,arr){ //递归重组后台返回的菜单树
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
                    arr.push(dataObj)
                    this.changeData(obj.list[i].children,arr[i].children) 
                }
            }
        },
        async getNavData(){
            const data = await productExhibitionClassIfy({
                cinemaUid:this.cinemaUid,
            }) 

            console.log(data);
            let arr = [];
            this.changeData(data.data.children,arr)
            this.data = arr;
        },
        async getListData(){
            const data = await productExhibitionHomeDefault({
                cinemaUid:'805852',
                terminalCode:this.terminalId,
                categoryUid:this.navUid,
                pageSize:this.pageSize,
                currentPage : this.currentPage,
            })
            this.listData = data.data.data;
            this.currentPage = data.data.currentPage;
            this.totalNum = data.data.totalNum;
            console.log(data)
        },
        async getListDataByCode(){
            const data = await productExhibitionGetProductByCode({
                cinemaUid:this.cinemaUid,
                terminalCode:this.terminalId,
                code:this.searchGoodsText,
                pageSize:this.pageSize,
                currentPage : this.currentPage,
            })
            this.listData = data.data.data;
            this.currentPage = data.data.currentPage;
            this.totalNum = data.data.totalNum;
        }
        
    },
    created() {
    },
    async mounted() {
        this.getNavData()
        this.getListData()
        this.scroll = new BScroll(this.$refs.navScroll,{
            scrollY:false,
            scrollX:true,
            click:true,
        })
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
            this[CART_SEARCH_GOODS_TEXT](this.seachAddition)
            this.getListData()
        },
        async searchGoodsText(val){
            this.currentPage = 1;
            if(val == '') return
            this.getListDataByCode()
            
            
            
        }
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
            .control-btn{
                margin-left: 1vw;
                display: inline-flex;
                flex-wrap: nowrap;
                height: 100%;
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
                .carousel-container {
                    margin: 0 auto;
                    height: 100%;
                    overflow: hidden;
                    flex:1;
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
                .border {
                    box-shadow: 0 0 0 1px $btn-background-color-theme;
                }
                .good-item {
                    position: relative;
                    box-sizing: border-box;
                    display: inline-flex;
                    flex-direction: column;
                    transition: all .3s;
                    width: 24%;
                    margin-bottom: .8%;
                    margin-left: .5%;
                    border-radius: 4px;
                    z-index: 99;
                    .good-img {
                        box-sizing: border-box;
                        width: 100%;
                        height: 19vh;
                        border-radius: 4px;
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
                        border-radius: 2px;
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


