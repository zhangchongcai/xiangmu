<template>
    <div class="bar-warp">
        <div class="seach-menu bl">
            <el-input v-model="seachAddition" @keyup.enter.native="search" placeholder="请输入店内码/条形码/商品编码"></el-input>
            <el-button @click="search">查询</el-button>
        </div>
        <div class="pay-menu bl">
            <ul v-if="allPayWays.length">
                    <li v-for="(item, index) in allPayWays.slice(0, 5)" :key="'pay' + index" @click="showPayPanel(item)">
                        {{item.payTypeName}}
                    </li>
                <li v-if="allPayWays.length > 5" @click="showMorePayMethods">更多<span class="el-icon-arrow-down" style="margin-left:.2vw"></span></li>
            </ul>
        </div>
        <ul class="detail-menu bl" @click="hanlderDetail">
            <li>
                <span>订单总额:</span>
                <span>￥</span>
                <span class="money" id="origin">{{cartData.notPayAmount?cartData.notPayAmount:0}}</span>
            </li>
            <li>
                <span>明细</span>
                <span :class="['el-icon-arrow-down',cartIsshow?'cartIsshow':'']" style="margin-left:5px;font-size:1.2vw"></span>
            </li>
        </ul>
        
        <!-- <div v-if="showVipCheckBox" class="number-container">
            <div class="number-wrapper">
                <div style="width: 100%; height: 40px; font-size: 1.3vw; color: #333; display: flex; padding: 0 20px; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span>请输入手机号码</span>
                    <i class="iconfont iconguanbi" @click="showVipCheckBox = false"></i>
                </div>
                <el-input style="width: 56%; margin-bottom: 30px;" v-model="telNumber" placeholder="手机号码"></el-input>
                <NumberKeyBoard @keynumber="getKeynumber"  style="position: relative; width: 56%;"></NumberKeyBoard>
                <div style="width: 100%; display: flex; justify-content: center; margin-top: 20px;">
                  <el-button size="small" style="margin-right: 20px;" type="info" @click="showVipCheckBox = false">取消</el-button>
                  <el-button size="small" type="success" @click="checkoutVip">确定</el-button>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex'
import {PAY_DIALOG_TRIGER, MORE_PAY_TRIGER, PAY_METHOD_TRIGER,CART_SEARCH_GOODS_TEXT, GET_ACTIVITY_DATA, SET_VIP_CHECKOUT_BOX, CART_FIND_CART_DATA} from 'types'
import { VM_ON_GOODS_SEACH } from 'types/vmOnType.js'
import util from 'src/http/app'
import FormatterData from  'src/http/voucherData'
import NumberKeyBoard from 'components/numberKeyBoard'
export default {
    data() {
        return {
            seachAddition:'',
            noModal: true,
            // showVipCheckBox: false,
            cartIsshow:false,
            // telNumber: ''
        }
    },
    computed: {
      ...mapGetters([
          'allPayWays',
          'seatSelection',
          'cartData',
          'configData',
          'cartDatalist'
      ])
    },
    methods: {
        ...mapMutations({
            MORE_PAY_TRIGER, //显示隐藏更多支付
            PAY_DIALOG_TRIGER, //显示隐藏支付弹框
            PAY_METHOD_TRIGER, //修改支付方式
            CART_SEARCH_GOODS_TEXT,//修改输入值
            SET_VIP_CHECKOUT_BOX, //打开vip输入框环境
        }),
        ...mapActions([
            GET_ACTIVITY_DATA,
            CART_FIND_CART_DATA
        ]),
        //检索用户持有的会员卡
        // checkoutVip() {
        //    checkoutVip({memberNumber: this.telNumber}).then(res => {
        //        console.log(res)
        //    })
        // },
        // getKeynumber(val) {
        //   this.telNumber = val
        // },
        showPayPanel(item) {
           if((this.seatSelection.length || this.cartDatalist.length) && item.payTypeCode != '0X03') {
                  this.PAY_METHOD_TRIGER(item)
                  this.PAY_DIALOG_TRIGER()
                  this.GET_ACTIVITY_DATA()
           }else if((this.seatSelection.length || this.cartDatalist.length) && item.payTypeCode == '0X03') {
               this.PAY_METHOD_TRIGER(item)
               this.SET_VIP_CHECKOUT_BOX(true);
           }else {
               this.$message({
                message: '请您选择座位或者卖品',
                type: 'warning'
                });
           }
        },
        showMorePayMethods() {
             this.MORE_PAY_TRIGER()
        },
        hanlderDetail() {
            this.$emit('handerDetail')
            this.cartIsshow = !this.cartIsshow
        },
        search() {
            this.$vm.$emit(VM_ON_GOODS_SEACH,this.seachAddition)
            this.seachAddition = '';
        },
    },

    components: {
        NumberKeyBoard
    }
}   
</script>

<style lang="scss">
    .bar-warp{
        position:fixed;
        bottom:8.9vh;
        right: 0;
        left: 0;
        height: 5.2vh;
        line-height: 5.2vh;
        display: flex;
        z-index: 100;
        background: #fff;

        .number-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #0000006c;
            display: flex;
            justify-content: center;
            align-items: center;

            .number-wrapper {
                width: 40vw;
                padding: 20px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                position: relative;
            }
        }
        .bl{
            display: inline-block;
            vertical-align: middle;
            border-radius: 2px;
        }
        .seach-menu{
            @include bg_seachPay_color($bg-searchPaydetalTabColor);
            box-sizing:border-box; 
            height: 100%;
            width: 30%;
            padding: 0 1.6vw;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            .el-input{
                display: inline-block;
                flex: 1;                
                line-height: 28px;
                font-size: $font-size12;
                .el-input__inner{
                    height: 3.6vh;
                }
            }
            .el-button{
                height: 3.6vh;
                padding:0 0.8vw;
                line-height: 3.6vh;
                margin-left: 5%;
                font-size: $font-size12;
                span{
                    font-size: $font-size12;
                }
            }
        }
        .pay-menu{
            box-sizing: border-box;
            height: 100%;
            flex: 1;
            margin:0 2px;
            ul{
                overflow: hidden;
                font-size: 0px;
                height: 100%;
                width: 100%;
                display: flex;
                li{
                    @include bg_seachPay_color($bg-searchPaydetalTabColor);
                    @include font_color($font-color-searchPaydetalTabColor);
                    font-size: $font-size12;
                    border-radius: 2%;
                    height: 100%;
                    flex:1;
                    cursor: pointer;
                    text-align: center;
                    display: inline-block;
                    &{
                        margin-left: 2px;
                    }
                    &:first-child{
                        margin-left: 0px;
                    }
                    &:hover{
                        @include bg_seachPay_color($bg-searchPaydetalTabColor);
                    }
                }
            }
        }
        .detail-menu {
            display: flex;
            box-sizing: border-box;
            float: right;
            font-size: $font-size12;
            width: 21%;  
            text-align: center;
            color: #ffffff;
            border: #3b74ff 1px solid;
            @include btn-background-color-theme($btn-background-color-theme);
            border-radius: 2px;
            cursor: pointer;
            padding:0px 1.8vw;
            li{
                display: inline-block;
                text-align: left;
            }
            li:first-child{
                flex:1.2;
                span{
                    display: inline-block;
                    height: 100%;
                    font-size: $font-size12;
                }
                .money{
                    font-size: 1.75vw;
                }
            }
            li:last-child{
                span{
                font-size: $font-size12;
                }
            }
            .cartIsshow{
                transform: rotate(180deg)
            }
        }
        
    }
</style>
