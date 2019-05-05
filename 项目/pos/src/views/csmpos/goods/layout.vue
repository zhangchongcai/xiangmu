<template>
    <div class="sell-goods">
        <nav class="nav-header" v-clickoutside="handlerOutside">
            <div class="nav-warp">
                <div class="carousel-container"  ref="navScroll" >
                    <ul class="carousel" ref="carousel">
                        <li v-for="(item,ind) in data" :key="ind" :class='["carousel-item",ind==oneMenu? "oneMenue_activ" : ""]' @click="handlerOnemenu(ind)">
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
                    <div class="carousel-container">
                        <ul class="carousel" ref="carouselSed">
                            <li v-for="(item,ind) in data[oneMenu].children" :key="ind" :class='["carousel-item",ind==towMenuSele? "tow-active" : ""]' @click="handlerTwomenu(ind)">
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
                                        :command="subItem.name" style="font-size:1.2vw">{{subItem.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </li>
                        </ul>
                    </div>
                    <div class="btn">
                        <el-button plain class="el-icon-arrow-left nav-button"   :disabled="sedLeftDisabled" @click="handleCarouselSed(true)"></el-button>
                        <el-button plain class="el-icon-arrow-right nav-button"  :disabled="sedRightDisabled"  @click="handleCarouselSed(false)"></el-button>
                    </div>
                </div>
            </div>
        </nav>
        <main class="main">
            <div class="content">
                <div class="breadcrumb">
                    <div>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item >套餐</el-breadcrumb-item>
                            <el-breadcrumb-item>三级套餐</el-breadcrumb-item>
                            <el-breadcrumb-item ><span class="last-breadcrumb">三口之家套餐</span> </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="modul-warp">
                        <div class="modul">
                            <div :class='isFont?"":"active"' @click="modulChange(false)">图片模式</div>
                            <div :class='isFont?"active":""'  @click="modulChange(true)">文字模式</div>
                        </div>
                    </div>
                </div>
                <ul class="good-list">
                    <li :class='["good-item",ind==isSelectGoods?"border":""]'
                    :style="goodListsale?'width:15.7vw':''" 
                    @click="SelectIntroduce($event,ind)"
                    v-for="(item,ind) in listData" 
                    ref="goodsItem"
                    :key="ind" 
                    >
                        <div class="good-img" v-show="!isFont" >
                            <img :src="item.picUrl" alt="">
                        </div>
                        <div :class='["introduce",ind==isSelectGoods?"isSelectGoods":""]' :style="!isFont?'border-top:none':''">
                            <p class>{{item.name}}</p>
                            <p class>¥{{item.price}}</p>
                        </div>
                    </li>
                </ul>

                <div class="footer">
                    <div class="pagation">
                        <div href="javascriopt::void(0)" @click="pagination('pre')" class="pagebtn iconfont iconzuojiantouda"></div>
                        <span>{{currentPage}}/{{goodsList.length/8}}</span>
                        <div href="javascript::void(0)" @click="pagination('next')" class="pagebtn iconfont iconyoujiantouda"></div>
                    </div>
                    <span class="totall">总计：{{goodsList.length}}件商品</span>
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
import {mapGetters} from 'vuex'
import {SHOW_MORE_TICKETS} from 'types'
import { productExhibitionClassIfy, productExhibitionHomeDefault,} from 'http/apis'
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
            //商品
            goodsList:[
                { name:'三人乐享套餐',price:'22.00'}, { name:'去微软套餐',price:'12.00'},
                { name:'绕太阳套餐',price:'24.00'}, { name:'儿童套餐',price:'78.00'},
                { name:'三人乐享套餐',price:'22.00'}, { name:'去微软套餐',price:'12.00'},
                { name:'规范的套餐',price:'42.00'}, { name:'体验套餐',price:'43.00'},
                { name:'规范的套餐',price:'42.00'}, { name:'体验套餐',price:'43.00'},
                { name:'阿道夫套餐',price:'12.00'}, { name:'法国和套餐',price:'65.00'},
                { name:'三人乐享套餐',price:'22.00'}, { name:'去微软套餐',price:'12.00'},
                { name:'阿道夫套餐',price:'12.00'}, { name:'法国和套餐',price:'65.00'}, 
                { name:'阿道夫套餐',price:'12.00'}, { name:'法国和套餐',price:'65.00'},
                { name:'规范的套餐',price:'42.00'}, { name:'体验套餐',price:'43.00'},
                { name:'绕太阳套餐',price:'24.00'}, { name:'儿童套餐',price:'78.00'},
                { name:'绕太阳套餐',price:'24.00'}, { name:'儿童套餐',price:'78.00'},
            ],
            //分页
            pagationGoodslist:[
                { name:'三人乐享套餐',price:'22.00'}, { name:'去微软套餐',price:'12.00'},
                { name:'阿道夫套餐',price:'12.00'}, { name:'法国和套餐',price:'65.00'},
                { name:'规范的套餐',price:'42.00'}, { name:'体验套餐',price:'43.00'},
                { name:'绕太阳套餐',price:'24.00'}, { name:'儿童套餐',price:'78.00'},
            ],
            listData:[],
            currentPage:1,
            pageSize:8, //默认八个
            isSelectGoods: 0,
            //换票类
            dialogList:[],
            data:[],
            scroll:null,
            
        };
    },
    computed: {
        ...mapGetters([
            'changingTicket'
        ])
    },
    methods: {
        navChange(type){
            console.log(window.innerWidth,this.scroll)
            if(type){
                this.scroll.scrollTo(this.scroll.x+window.innerWidth*(11.7/100),0)
                console.log(this.scroll.x)
            }else{
                this.scroll.scrollTo(this.scroll.x + -(window.innerWidth*(11.7/100)),0)
                console.log(this.scroll.x)
            }
        },
        handleCarousel(isLeft) {
            let current = this.$refs.carousel.style.transform.replace(/[^0-9\-.,]/g,"");
            // let width = this.$refs.carousel.childNodes[0].offsetWidth + 1 * 5;
            console.log(current,'当前');
            let width =Number(11.7) ; //11.3 + 0.4
            let itemNum = this.$refs.carousel.childNodes.length;
            if (isLeft) {
                // console.log('对比',((itemNum - 8) * -width).toFixed(1),-current)
                // 左
                if (((itemNum - 8) * -width).toFixed(1) == current || itemNum < 7) {
                    this.leftDisabled = true;
                }
                if ((itemNum - 7) * width == -current) {
                    this.rightDisabled = true;
                }
                    // this.rightDisabled = false;
                    this.$refs.carousel.style.transform = `translateX(${Number(current) - width}vw)`;
            } else {
                // 右
                if (-current <= width) {
                    this.rightDisabled = true;
                }
                if (current >= 0) {
                    return;
                }
                this.leftDisabled = false;
                this.$refs.carousel.style.transform = `translateX(${Number(current) + width}vw)`;
            }
        },
        handleCarouselSed(isLeft) {
            let current = this.$refs.carouselSed.style.transform.replace(/[^0-9\-.,]/g,"");
            // console.log(current,'当前');
            let width =Number(13.3);
            let itemNum = this.$refs.carouselSed.childNodes.length;
            if (isLeft) {
                // 左
                if (((itemNum - 8) * width.toFixed(1)) == -current ) {
                    this.sedLeftDisabled = true;
                }
                if ((itemNum - 7) * width ==-current || itemNum < 7) {
                    this.rightDisabled = true;
                    return;
                }
                this.sedRightDisabled = false;
                this.$refs.carouselSed.style.transform = `translateX(${Number(current) - width}vw)`;
            } else {
                // 右
                if (-current <= width) {
                    this.sedRightDisabled = true;
                }
                if (current >= 0) {
                    return;
                }
                this.sedLeftDisabled = false;
                this.$refs.carouselSed.style.transform = `translateX(${Number(current) + width}vw)`;
            }
        },
        //图片、文字模式
        modulChange(modul) {
            this.isFont = modul;
            console.log(this.isFont);
        },
        SelectIntroduce(e,ind) {
            this.isSelectGoods = ind;
            let span = document.createElement("span");
            span.className = "iconfont iconhuiyuan"
            span.style.position= 'absolute'
            span.style.transition = 'all 0.7s cubic-bezier(0.49,-0.29,0.75,0.41)';
            span.style.left = this.$refs.goodsItem[ind].getBoundingClientRect().left +this.$refs.goodsItem[ind].offsetWidth/2 +'px'
            span.style.top =  this.$refs.goodsItem[ind].getBoundingClientRect().top + this.$refs.goodsItem[ind].offsetHeight/2 + 'px'
            span.style.zIndex=99
            document.body.appendChild(span)
            let origin = document.querySelector("#origin");
            console.log(origin)
            var x1 = span.getBoundingClientRect().left;
            var y1 = span.getBoundingClientRect().top;
            console.log(x1,y1)
            var x2 = origin.getBoundingClientRect().left;
            var y2 = origin.getBoundingClientRect().top;
                console.log(x2,y2)
            //平移抛物经过原点，可以得到c==0
            //已知a
            var a = 0.002;
            // if(a)
            var b = (y2-y1 - a*(x2-x1)*(x2-x1))/(x2-x1);
            var timer = null;
            var count = 0;
            let maxX = x2 - x1 ;
            let maxY = y2 - y1 ;
            span.style.left = x1 + maxX + "px";
            span.style.top = y1 + maxY + "px";
            setTimeout(() => {
                document.body.removeChild(span)
            },700)
            // timer = setInterval( _=> {
            //     var xx = span.getBoundingClientRect().left;
            //     var yy = span.getBoundingClientRect().top;
            //     // count+=10;
            //     // var x = count;
            //     // var y = a*x*x + b*x;
            //     // span.style.left = x1 + x + "px";
            //     // span.style.top = y1 + y + "px";
            //     // span.style.transform = `translate3d(${x}px,${y}px,0)`
            //     span.style.left = xx + (maxX/70) + "px";
            //     span.style.top = yy + (maxY/70) + "px";
            //     if(span.getBoundingClientRect().top >y2){
            //         clearInterval(timer);
            //         document.body.removeChild(span)
            //     }
            // },10)


        },
        //一级菜单
        handlerOnemenu(ind) {
            this.oneMenu = ind;
            this.towMenuShow = true;
        },
        //二级菜单
        handlerTwomenu(ind) {
            this.towMenuSele = ind;
        }, 
        handlerOutside() {
            this.towMenuShow = false;
            this.towMenuSele = null;
        },
        handleDropdwon(command) {
            console.log(command)
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
            let len = this.goodsList.length;
            if(len>this.pageSize){
                if(type=='next'){
                    this.currentPage = this.currentPage+1 > Math.ceil(len / this.pageSize) ? this.currentPage :++this.currentPage
                    this.pagationGoodslist = this.goodsList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
                }else if(type=='pre'){
                    this.currentPage = this.currentPage-1 <= 0? this.currentPage : --this.currentPage
                    this.pagationGoodslist = this.goodsList.slice(this.currentPage*this.pageSize,(this.currentPage+1)*this.pageSize)
                }
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
                    console.debug
                    this.changeData(obj.list[i].children,arr[i].children) 
                }
            }
        },
        async getNavData(){
            const data = await productExhibitionClassIfy({
                cinemaUid:123465,
            }) 

            console.log(data);
            this.changeData(data.data.children,this.data)
        },
        async getListData(){
            const data = await productExhibitionHomeDefault({
                cinemaUid:'123123',
            })
            this.listData = data.data
            console.log(data)
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
        console.log(this.scroll)
    //   this.changeData(data.data.children)

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
                    background: #ffffff;
                    display: inline-block;
                    margin: 0 auto;
                    height: 100%;
                    max-width:93.1vw;
                    overflow: hidden;
                    .carousel {
                        display: inline-block;
                        white-space: nowrap;
                        transition: transform 1s;
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
                        height: 3.4vh;
                        text-align: center;
                        line-height: 3.4vh;
                        cursor: pointer;
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


