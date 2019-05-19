<template>
    <div v-if="payDialog" class="outter-wrapper">
        <div class="settlement-container">
            <div class="settlement-header">
              支付
              <i class="iconfont iconguanbi" @click="closePay"></i>
            </div>

            <div class="settlement-contents">
               <div class="settle-left">
                  <div class="header-name">订单详情</div>
                  <div class="detial">
                    <GoodsDetil :hiddenAction=false :cartData="cartData" :goodTitleshow="false"></GoodsDetil>
                  </div>
               </div>
               <div class="settle-right">
                   <div class="header-name">可参与优惠活动</div>
                   <div class="discount-activity">
                      <div v-show="activities.length" class="active-item" v-for="(item, index) in activities" :key="'active' + index">
                         <span class="item-name">{{item.name}}</span>
                         <span class="item-extend-btn">
                             <i class="iconfont iconyuanxingxialajiantou arrow-circle"></i>
                         </span>
                      </div>

                      <div v-show="activities.length" class="arrow-btn pre-btn">
                          <i class="iconfont iconshangjiantouanniu"></i>
                      </div>
                      <div v-show="activities.length" class="arrow-btn next-btn">
                          <i class="iconfont iconxiajiantouanniu"></i>
                      </div>

                      <div class="active-default" v-show='!activities.length'>
                          暂无优惠活动！
                      </div>
                   </div>
                   <div class="header-name">支付方式</div>
                   <div class="pay-container">
                       <div class="pay-methods">
                         <div :class="['default-pay', payMethod.currentPayMethod == item.payTypeName ? 'active' : '']" v-for="(item, index) in payMethods" :key="'pay' + index" @click="selPay(item, index)">
                             <span>{{item.payTypeName}}</span>
                         </div>
                         <div v-if="allPayWays.length > 5" :class="['default-pay']" @click="showMorePayMethods">
                             更多
                         </div>
                       </div>

                       <components :is="componentsName" @closePay="PAY_DIALOG_TRIGER" @payIt="payIt"></components>
                   </div>

                   <div v-if="payResult" class="pay-result">
                        <span>已支付:
                            <span class="pay-name">{{payMethod.currentPayMethod}}</span>
                            <span class="pay-price">{{payNum.realPayNum - payNum.realChange}}元</span>
                        </span>
                    </div>
               </div>
            </div>
        </div>

        <!-- 更多支付方式 -->
        <more-pay usedInBox="paypop"></more-pay>
        <!-- 查询会员优惠券 -->
        <check-coupon></check-coupon>
        <!-- 优惠票券查询结果 -->
        <coupon-results></coupon-results>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {PAY_DIALOG_TRIGER, MORE_PAY_TRIGER, PAY_METHOD_TRIGER, GET_KIND_PRICE, SET_RETURN_PAY, SET_PAY_RESULT,GET_CART_BILLCODE, CLEAR_SELECTION, GET_CART_DATA} from 'types'
import {payIt, findCart, saveSaleBill, settleIt, clearAllTicket} from 'src/http/apis.js'
import CouponComp from 'components/settlement/CouponComp'
import WeComp from 'components/settlement/WeComp'
import AliComp from 'components/settlement/AliComp'
import CardComp from 'components/settlement/CardComp'
import VipComp from 'components/settlement/VipComp'
import CashComp from 'components/settlement/CashComp'
import ScoreComp from 'components/settlement/ScoreComp'
import HoldComp from 'components/settlement/HoldComp'
import UnionPay from 'components/settlement/unionPay'
import MorePay from 'components/dialog/MorePay'
import CheckCoupon from 'components/settlement/CheckCoupon'
import GoodsDetil from 'components/cart/DetailGood'
import CouponResults from 'components/settlement/CouponResults'
import util from 'src/http/app.js'
export default {
    data() {
        return {
          activities: [],

          currentPayIndex: 0,
          componentsTypeName: 'coupon'
        }
    },

    computed: {
       ...mapGetters([
           'payDialog',
           'allPayWays',
           'cartData',
           'payMethod',
           'payNum',
           'payData',
           'billCode',
           'cinemaUid',
           'billCodeUid',
           'terminalCode',
           'currentPlanCode',
           'payResult',
           'configData'
       ]),

       payMethods() {
           let arr = JSON.parse(JSON.stringify(this.allPayWays))  //注意深拷贝
           let result = []
           if(this.currentPayIndex < 4) {
               result = arr.slice(0, 4)
           }else {
               arr.splice(3, 1, this.allPayWays[this.currentPayIndex]) //从原始数组中截取选种值并替换掉显示的最后一项
               result = arr.slice(0, 4)
               this.componentsTypeName = this.allPayWays[this.currentPayIndex].payTypeName
               this.currentPayIndex = 3  //还原显示时的位置
           }
           return result;
       },

       componentsName() {
           switch(this.payMethod.currentPayMethod) {
               case '微信' || '':
               return 'WeComp';
               case '支付宝':
               return 'AliComp';
               case '银行卡支付':
               return 'CardComp';
               case '银联支付':
               return 'UnionPay'
               case '会员卡':
               return 'VipComp';
               case '现金支付':
               return 'CashComp';
               case '积分兑换':
               return 'ScoreComp';
               case 'hold':
               return 'HoldComp';
               case '票券':
               return 'CouponComp'
           }
       }
    },

    methods: {
        ...mapMutations([
           PAY_DIALOG_TRIGER,
           MORE_PAY_TRIGER,
           PAY_METHOD_TRIGER,
           GET_KIND_PRICE,
           SET_RETURN_PAY,
           SET_PAY_RESULT,
           GET_CART_BILLCODE,
           CLEAR_SELECTION,
           GET_CART_DATA
        ]),
        payIt() {  //确定支付，由子组件触发事件
          saveSaleBill({billCode: this.billCode}).then(res => {
              if(res.code == 200) {
                  payIt({
                        cinemaUid: this.cinemaUid,
                        saleBillCode: this.billCode,
                        saleBillUid: this.billCodeUid,
                        payTypeCode: this.payMethod.currentPayMethodId,
                        body: "票美人鱼(3D)影票、可口可乐、爆米花",
                        payTypeName: this.payMethod.currentPayMethod,
                        returnAmount: this.payNum.realChange,
                        payAmount: Number(this.payNum.realPayNum),
                        authCode: this.payNum.authCode
                    }).then(res => {
                        if(res.code == 200 && res.data.status == 1) {
                            this.SET_RETURN_PAY(res.data.returnAmount)
                            this.SET_PAY_RESULT()
                        findCart({billCode: this.billCode}).then(res => {
                                        if(res.code == 200) {
                                            this.GET_KIND_PRICE(res.data)
                                            if(res.data.notPayAmount <= 0) {
                                                this.CLEAR_SELECTION()
                                                this.GET_CART_DATA({goodsList: []})
                                                settleIt({
                                                    billCode: this.billCode,
                                                    cinemaUid: this.cinemaUid,
                                                    original_price: this.payData.originalAmount,
                                                    plan_id: '6033851d-d764-45b0-839e-a8762299c24b',
                                                    saleBillUid: this.billCodeUid,
                                                    terminalCode: this.terminalCode,
                                                    total_price: this.payData.originalAmount
                                                }).then(res => {
                                                    if(res.status == 200) {
                                                        this.$message({
                                                            showClose: true,
                                                            message: "购买成功！谢谢",
                                                            type: 'success'
                                                        });
                                                        //结算成功后清空购物车
                                                        clearAllTicket({
                                                            billCode: this.billCode
                                                        }).then(res => {
                                                            this.GET_CART_BILLCODE('')
                                                        })
                                                        this.PAY_DIALOG_TRIGER()
                                                        // res.data.cinemaTicketInfo.forEach(item => {
                                                        //     console.log(JSON.stringify(item))
                                                        //     util.printTicket('film_print',item,this.configData,args=> {
                                                        //         console.log('打印数据：',args,'配置信息：',this.configData)
                                                        //     })
                                                        // })
                                                        console.log(JSON.stringify(res.data.trade_voucher_info))
                                                        console.log('取货凭证：')
                                                        console.log(JSON.stringify(res.data.get_voucher_info))
                                                    }
                                                })
                                            }
                                        }else {
                                            this.$message({
                                                        showClose: true,
                                                        message: res.msg,
                                                        type: 'error'
                                                    });
                                        }
                                    })
                        }else {
                           this.$message({
                                        showClose: true,
                                        message: res.msg,
                                        type: 'error'
                                    });
                           this.$ws.send({
                               cinemaUid: this.cinemaUid,
                               outTradeNo: this.billCode,
                               queryType: this.payMethod.currentPayMethodId,
                               saleBillPayUid: this.billCodeUid,
                               terminalCode: this.terminalCode,
                               tradeNo: '',
                           })
                        }
                    })
              }else {
                  this.$message({
                                    showClose: true,
                                    message: res.msg,
                                    type: 'error'
                                });
              }
          })
        },

        closePay() {
           this.PAY_DIALOG_TRIGER()
           this.SET_PAY_RESULT()
        },

        showMorePayMethods() {
            this.MORE_PAY_TRIGER()
        },

        selecDialogItem(val) {
           this.currentPayIndex = val
        },

        selPay(item, index) {
            this.currentPayIndex = index
            this.PAY_METHOD_TRIGER(item)
        }
    },

    components: {
        CouponComp,
        WeComp,
        AliComp,
        CardComp,
        VipComp,
        CashComp,
        ScoreComp,
        HoldComp,
        MorePay,
        CheckCoupon,
        GoodsDetil,
        CouponResults,
        UnionPay
    }
}
</script>

<style lang="scss" scoped>
 .outter-wrapper {
     width: 100vw;
     height: 100vh;
     background-color: #3333333a;
     position: fixed;
     bottom: 0;
     left: 0;
     z-index: 1200;
     transition: all 0.3s ease-in-out;

 }
  .settlement-container {
      width: 100vw;
      height: calc(100vh - 20px);
      position: absolute;
      bottom: 0;
      left: 0;
      background: $background-color-page-theme;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      overflow: hidden;

      .settlement-header {
          box-sizing: border-box;
          width: 100%;
          height: 6.3vh;
          background: $background-color-theme;
          color: $font-color-white;
          line-height: 6.3vh;
          padding: 0 20px;
          position: relative;

          .iconguanbi {
              position: absolute;
              right: 22px;
              top: 50%;
              transform: translateY(-50%);
              color: $font-color-white;
              font-size: $font-size14;
              padding: 8px;
              cursor: pointer;
          }
      }

      .settlement-contents {
          box-sizing: border-box;
          width: 100%;
          height: calc(100% - 6.3vh);
          background: $background-color-page-theme;
          padding: 2vw;
          display:flex;
          justify-content: space-between;
          align-items: flex-start;

          .header-name {
              font-size: $font-size14;
              color: $font-color3;
              font-weight: bold;
              height: 4vh;
          }
            .settle-left {
                width: 36vw;
                height: 100%;
                display: flex;
                flex-direction: column;
                .detial{
                    flex: 1;
                    overflow:auto;
                }
            }

          .settle-right {
              width: 58vw;
              height: 300px;

              .pay-result {
                    width: 100%;
                    background: #EBEBEB;
                    padding: 10px 0;
                    margin-top: -13vh;
                    font-size: $font-size12 !important;
                    color: $font-color3 !important;

                    .pay-price {
                        color: $font-color-orange !important;
                    }
                }

              .discount-activity {
                  width: 100%;
                  height: 15.9vh;
                  background: #ffffff;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  align-items: center;
                  position: relative;
                  margin-bottom: 12px;

                  .active-default {
                      font-size: $font-size12;
                      color: $font-color6;
                      margin-left: 12px;
                  }

                  .active-item {
                      width: 15.8vw;
                      height: 6vh;
                      box-sizing: border-box;
                      border: 1px solid #A7B8E4;
                      border-radius: 2px;
                      margin-left: 1%;
                      margin-top: 1%;
                      display: flex;
                      padding: 8px;
                      justify-content: space-between;
                      align-items: center;

                      .item-name {
                        flex: 0 0 80%;
                        width: 80%;
                        font-size: $font-size12;
                      }

                      .item-extend-btn {
                          flex: 0 0 2.0vw;
                          width: 2.0vw;
                          height: 2.0vw;
                          display: flex;
                          justify-content: center;
                          align-items: center;

                          .arrow-circle {
                              font-size: $font-size16;
                              color: $font-color-blue;
                          }
                      }
                  }

                  .arrow-btn {
                      width: 3.9vw;
                      height: 3.4vh;
                      position: absolute;
                      display: flex;
                      justify-content: center;
                      align-items: center;

                      .iconfont {
                          color: $themeColor;
                          font-size: $font-size22;
                      }
                  }

                  .pre-btn {
                      top: 8%;
                      right: 1%;
                  }

                  .next-btn {
                      bottom: 8%;
                      right: 1%;
                  }
              }

              .pay-container {
                  width: 100%;
                  height: 60.5vh;
                  background: #ffffff;
                  box-sizing: border-box;
                  padding: 12px;

                  .pay-methods {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;

                    .default-pay {
                        width: 10.4vw;
                        height: 5.2vh;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #A7B8E4;
                        border-radius: 2px;
                        margin-right: 1vw;

                        &:hover {
                            background: $btn-background-color-theme;
                            color: $font-color-white;
                            cursor: pointer;
                        }
                    }

                    .active {
                        background: $btn-background-color-theme;
                        color: $font-color-white;
                    }
                }
              }
          }
      } 
  }
</style>

