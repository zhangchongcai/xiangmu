<template>
    <div class="pay-containers">
      <div class="left">
          <div>
             <span>
                 <span class="pay-count">已优惠：</span>
                 <span class="count-num rest-num">{{payData.couponAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin: 8px 0 20px 0;">
             <span class="vip-info">卡号： {{vipInfo.cardNo}}</span>
              <span class="vip-info">余额： {{vipInfo.totalBalance + "元"}}</span>
               <span class="vip-info">积分： {{vipInfo.scoreBalance + "分"}}</span>
         </div>
         <div style="margin: 8px 0;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{payData.payAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{payData.notPayAmount + "元"}}</span>
             </span>
         </div>

         <div class="realPay">
             <span class="input-container-side">实收:</span>
             <input class="input-container" v-model="cashes" type="text" placeholder="实收数额">
             <span class="input-container-side">元</span>
         </div>

          <check-coupon-comp @openCouponCheckoutBox="openCouponCheckoutBox"></check-coupon-comp>
      </div>

      <div class="right">
        <NumberKeyBoard :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <div class="btn-container">
            <span class="result-btn" @click="cancle">取消</span>
            <span class="result-btn confirm-btn" @click="payIt">确定</span>
            <span v-show="vipInfo.totalBalance < payData.notPayAmount && vipInfo.cardTypeCode == 'stored_card'" class="result-btn quickCash" @click="toRecharge(vipInfo.cardNo)">充值</span>
        </div>
      </div>
    </div>
</template>

<script>
import commonutil from 'util'
import {checkoutVip} from 'src/http/apis'
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH, SET_VIP_INFO, PAY_METHOD_TRIGER} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
import CheckCouponComp from 'components/coupons/CheckCoupon'
export default {
    data() {
        return {
            cashes: '',
            vipPay: true,
            aliPay: false
        }
    },

   computed:{
      ...mapGetters([
          'payData',
          'returnPay',
          'payNum',
          'vipInfo',
          'availableCouponList',
          'billCode',
          'isNeedPwd'
      ])
    },

    watch: {
        cashes() {
          this.cashes = commonutil.NumberTransform(this.cashes)
          let change =Number(this.cashes) -  Number(this.payData.notPayAmount)
          change = change <= 0 ? 0 : change
          this.SAVE_CHANGE_CASH({cash: this.cashes, change: change})
        },
        $route() {
            this.checkMemberInfo()
        },
        vipPay(val) {
           if(val) {
               this.aliPay = false
               this.PAY_METHOD_TRIGER({
                   payTypeName: '会员支付',
                   payTypeCode: '0X03'
               })
           }
        },
        aliPay(val) {
           if(val) {
               this.vipPay = false
               this.PAY_METHOD_TRIGER({
                   payTypeName: '支付宝',
                   payTypeCode: 'ALIPAY'
               })
           }
        }
    },

    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH,
            SET_VIP_INFO,
            PAY_METHOD_TRIGER
        ]),

        //充值后查询会员信息
        async checkMemberInfo() {
            let vipResultdata = await checkoutVip({memberNumber: this.vipInfo.cardNo, code: this.billCode})
            if(vipResultdata.code == 200) {
                this.SET_VIP_INFO(vipResultdata.data.memberCardVO)
            }else {
                this.$message({
                            message: vipResultdata.msg || '查询会员信息失败',
                            type: 'warning'
                            });
            }
        },

        //跳转到充值页面
        toRecharge(memberNo) {
        //    console.log(this.vipInfo)
           this.$router.push({path: `/member/memberRecharge`, query: { phoneOrCard: memberNo, perform: true}})
        },

        showResult(value) {
           this.cashes = value;
        },

        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },

        payIt() {
          if(this.cashes || this.payData.notPayAmount == 0) {
             if(this.cashes > this.payData.notPayAmount) {
                 this.$message({
                                showClose: true,
                                message: "实收金额不能大于未付金额",
                                type: 'warning'
                             });
             }else {
               if(this.isNeedPwd) {
                   this.$emit('payIt')
               }else {
                   this.$emit('inputMemberPassword')
               }
             } 
          }else {
               this.$message({
                                showClose: true,
                                message: "请输入支付价格",
                                type: 'error'
                             });
          }
        },

        //清空上一笔支付金额
        clearOldCash() {
          this.cashes = ''
        },

        cancle() {
          this.$emit('closePay')
        },
    },

    components: {
        NumberKeyBoard,
        CheckCouponComp
    }
}
</script>

<style lang="scss" scoped>
  .pay-containers {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 6px;

    .left {
        width: 34vw;

        .vip-info {
            font-size: $font-size12;
            color: $font-color9;
            transform: scale(0.8);
            margin-right: 12px;
        }

        .pay-name {
            font-size: $font-size12;
            color: $font-color6;
        }

        .realPay, .action-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 8px 0;

            .input-container {
                display: block;
                width: 16.8vw;
                height: 4.2vh;
                border: 1px solid #bcbcbc;
                border-radius: 2px;
                padding: 0 12px;
                margin: 0 4px;
            }
            .input-container-side {
                display: flex;
                height: 4.9vh;
                align-items: center;
                font-size: $font-size12;
                color: $font-color6;
            }
        }

        .pay-count {
            font-size: $font-size12;
            color: $font-color6;
            margin-right: 2px;
        }

        .count-num {
            font-size: $font-size14;
            font-weight: bold;
        }

        .total-num  {
            margin-right: 50px;
            color: $font-color3;
        }

        .rest-num {
            color: #FF7900;
        }

        .input-container {
            display: block;
            width: 22.8vw;
            height: 4.9vh;
            border: 1px solid #bcbcbc;
            border-radius: 2px;
            padding: 0 12px;
            margin-top: 30px;
            margin-bottom: 8px;
        }

        .action-container {
            margin-top: 8px;
            margin-bottom: 2px;

            .default-btn {
                border-radius: 2px;
                border: 1px solid $btn-background-color-theme;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: $font-color-blue;
                font-size: $font-size12;
            }

            .add-num {
                width: 6.1vw;
                height: 4.2vh;
                margin-right: 8px;
            }

            .check-num {
                width: 12.7vw;
                height: 4.2vh;
            }

            .coupon-num {
               font-size: $font-size12;
               color: $font-color6;
               margin-top: 15px;
               margin-bottom: 4px;
            }

            .coupon-container {
                box-sizing: border-box;
                width: 22.9vw;
                background: #EFF3FF;
                padding: 10px;

                .coupon-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;

                    .num-string {
                        font-size: $font-size12;
                        color: $font-color3;
                    }

                    .icon-neiye-shanchu {
                        font-size: $font-size12;
                        color: $themeColor;
                    }
                }
            }
        }

        .open-coupon-btn {
            width: 6.3vw;
            height: 4.2vh;
            background: #ffffff;
            border-color: $blue-color;
            color: $blue-color;
            padding: 0;
            font-size: $font-size12;
        }
    }

    .right {
        width: 23vw;
        .btn-container {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }

        .result-btn {
           display: inline-flex;
           width: 6.8vw;
           height: 5.2vh;
           justify-content: center;
           align-items: center;
           border: 1px solid $btn-background-color-theme;
           border-radius: 4px;
           color: $font-color-blue;
           font-size: $font-size14;
           margin-top: 1.4vh;
           cursor: pointer;
        }

        .confirm-btn {
            background: $btn-background-color-theme;
            color: $font-color-white;
        }

        .quickCash {
             background: $btn-background-color-orange;
             color: $font-color-white;
             border: 1px solid $btn-background-color-orange;
        }
    }
  }
</style>


