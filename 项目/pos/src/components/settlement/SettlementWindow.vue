<template>
    <div v-if="payDialog" class="outter-wrapper" v-loading="loading"
    element-loading-text="支付结算中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
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

                   <div v-if="payData.payedAmount != 0" class="pay-result">
                        <span>已支付:
                            <span class="pay-name">{{payMethod.currentPayMethod}}</span>
                            <span class="pay-price">{{payData.payedAmount}}元</span>
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
import {PAY_DIALOG_TRIGER, MORE_PAY_TRIGER, PAY_METHOD_TRIGER, GET_KIND_PRICE, SET_RETURN_PAY, CART_SET_GOODS_DATA, SET_PAY_RESULT,GET_CART_BILLCODE, CLEAR_SELECTION, GET_CART_DATA, CHECK_CURRENT_SEAT_STATUS} from 'types'
import {payIt, findCart, saveSaleBill, settleIt, clearAllTicket, syncFlow,movieTicketSuccess, findTimeSeatStatus} from 'src/http/apis.js'
import CouponComp from 'components/settlement/CouponComp'
import WeComp from 'components/settlement/WeComp'
import AliComp from 'components/settlement/AliComp'
import CardComp from 'components/settlement/CardComp'
import VipComp from 'components/settlement/VipComp'
import CashComp from 'components/settlement/CashComp'
import ScoreComp from 'components/settlement/ScoreComp'
import HoldComp from 'components/settlement/HoldComp'
import UnionPay from 'components/settlement/UnionPay'
import MorePay from 'components/dialog/MorePay'
import CheckCoupon from 'components/settlement/CheckCoupon'
import GoodsDetil from 'components/cart/DetailGood'
import CouponResults from 'components/settlement/CouponResults'
import util from 'src/http/app.js'
export default {
    data() {
        return {
          activities: [],
          loading: false,
          currentPayIndex: 0,
          componentsTypeName: 'coupon',
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
           'terminalId',
           'currentFilmId',
           'payResult',
           'configData',
           'cinemaCode',
           'currentPlanCode'
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

        // XRMB 现金
        // 0X03 会员卡
        // XUNP 银行卡
        // 0X09 票券
        // 0X08 留座
        // INCRM 积分
        // WLDS 网络代售
        // 0X10 影院补贴

       componentsName() {
           switch(this.payMethod.currentPayMethodId) {
               case '微信':
               return 'WeComp';
               case '支付宝':
               return 'AliComp';
               case 'XUNP':
               return 'CardComp';
               case '银联支付':
               return 'UnionPay'
               case '0X03':
               return 'VipComp';
               case 'XRMB':
               return 'CashComp';
               case 'INCRM':
               return 'ScoreComp';
               case '0X08':
               return 'HoldComp';
               case '0X09':
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
           GET_CART_DATA,
           CART_SET_GOODS_DATA,
           CHECK_CURRENT_SEAT_STATUS
        ]),
        //错误提示
        wrongTip(res) {
            this.loading = false
            this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
        },
        async payIt() {  //确定支付，由子组件触发事件
          this.loading = true
          let saveData = await saveSaleBill({billCode: this.billCode}), payData, findCartData, settlementData;  //定义查询结果变量 减少深度嵌套导致的深度查询
          if(saveData.code == 200) {
              payData = await payIt({
                cinemaUid: this.cinemaUid,
                saleBillCode: this.billCode,
                saleBillUid: this.billCodeUid,
                payTypeCode: this.payMethod.currentPayMethodId,
                body: "票美人鱼(3D)影票、可口可乐、爆米花",
                payTypeName: this.payMethod.currentPayMethod,
                returnAmount: this.payNum.realChange,
                payAmount: Number(this.payNum.realPayNum),
                authCode: this.payNum.authCode
              })
          }else {
              this.wrongTip(saveData)
          }
          if(payData.code == 200 && payData.data.status == 1) { 
            this.SET_RETURN_PAY(payData.data.returnAmount)
            this.SET_PAY_RESULT()
            findCartData = await findCart({billCode: this.billCode})
          }else {
            this.wrongTip(payData)
            this.$ws.send({
                cinemaUid: this.cinemaUid,
                outTradeNo: this.billCode,
                queryType: this.payMethod.currentPayMethodId,
                saleBillPayUid: this.billCodeUid,
                terminalCode: this.terminalId,
                tradeNo: ''
            })
          }
          if(findCartData.code == 200) {
              this.GET_KIND_PRICE(findCartData.data)
              if(findCartData.data.notPayAmount <= 0) {
                 this.CLEAR_SELECTION()
                 this.GET_CART_DATA({goodsList: []})
                 settlementData = await settleIt({
                    billCode: this.billCode,
                    cinemaUid: this.cinemaUid,
                    original_price: this.payData.originalAmount,
                    plan_id: this.currentFilmId,
                    saleBillUid: this.billCodeUid,
                    terminalCode: this.terminalId,
                    total_price: this.payData.originalAmount
                 })
              }else {
                    this.loading = false
                    this.$message({
                                showClose: true,
                                message: "请完成剩余支付",
                                type: 'warning'
                            });
                }
          }else {
              this.wrongTip(findCartData)
          }
          if(settlementData.status == 200) {
                this.$message({
                    showClose: true,
                    message: "购买成功！谢谢",
                    type: 'success'
                });
                //结算成功后清空购物车
                await clearAllTicket({
                    billCode: this.billCode
                }).then(res => {
                    this.GET_CART_BILLCODE('')
                    this.CART_SET_GOODS_DATA([])
                })
                syncFlow({saleBillUid: this.billCodeUid})
                findTimeSeatStatus({
                        cinemaCode: this.cinemaCode,
                        planCode: this.currentPlanCode
                    }).then(res => {
                        if(res.code == 200) {
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })
                this.PAY_DIALOG_TRIGER()
                this.loading = false
                let cti = settlementData.data.cinemaTicketInfo
                let index =  0 
                let successPrintArr=[]
                this.printTicket(cti , index , successPrintArr)
                // console.log(JSON.stringify(settlementData.data.trade_voucher_info))
                // console.log('取货凭证：')
                // console.log(JSON.stringify(settlementData.data.get_voucher_info))
          }else {
              this.wrongTip(settlementData)
          }
        },
        printTicket(cti,index,successPrintArr) {
            let cel = cti[index]
            util.printTicket('film_print',cel,this.configData,args=> {
                if(args == "浏览器不支持此功能"){
                    return this.$message.error('浏览器不支持打印功能')
                }
                console.log('打印：',index,'影票 ')
                console.log("数据：",cel)
                if(args[0]==0){
                    successPrintArr.push(cel.ticketUid)
                    this.$message({
                                showClose: true,
                                message: `打印完成第${index+1}张影票`,
                                type: 'success',
                                duration:1000
                            });
                }else{
                    this.$message.error({
                                type:'error',
                                showClose: true,
                                message:`打印第${index+1}张影票失败`,
                                duration:0
                    })
                }
                index++
                if(index<cti.length){
                    console.log('打印影票')
                    this.printTicket(cti,index,successPrintArr)
                }else{
                    //打印结束
                    console.log(successPrintArr,)
                    this.$message({
                                message:'打印结束！',
                                showClose: true,
                                type:'success',
                                duration:3000
                        })
                    //打印结束后发起打印结果的请求
                    movieTicketSuccess(successPrintArr).then(res => {
                        console.log('打印完成后发起打印结果请求',res)
                    })
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

