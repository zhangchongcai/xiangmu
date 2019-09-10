<template>
    <div class="pay-containers">
      <div class="left">

          <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">原价：</span>
                 <span class="count-num total-num">{{payData.originalAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">优惠：</span>
                 <span class="count-num total-num">{{payData.couponAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{payData.payAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">已付款：</span>
                 <span class="count-num total-num">{{payData.payedAmount + "元"}}
                     <span v-show="payData.voucherAmount > 0" style="font-size: 1.02vw; margin-left: 10px">({{"券抵扣: " + payData.voucherAmount + "元"}})</span>
                 </span>
             </span>
         </div>
         <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{payData.notPayAmount + "元"}}</span>
             </span>
         </div>

         <div class="realPay">
             <span class="input-container-side">实收：</span>
             <input class="input-container" v-model="cashes" type="text" placeholder="实收数额" />
             <span class="input-container-side">元</span>
         </div>

         <div class="action-container">
             <span v-for="(item, index) in fixedValue" :key="'value' + index" class="default-btn" @click="selFixedValue(item.value)">
                 {{item.name}}
             </span>
         </div>

         <div style="margin-top: 2px; margin-bottom: 2px;">
             <span>
                 <span class="pay-count">找零：</span>
                 <span class="count-num total-num">{{(payNum.realChange).toFixed(2) + "元"}}</span>
             </span>
         </div>
        <check-coupon-comp @openCouponCheckoutBox="openCouponCheckoutBox"></check-coupon-comp>
      </div>

      <div class="right">
        <NumberKeyBoard v-model="cashes" :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <div class="btn-container">
            <span class="result-btn" @click="cancle">取消</span>
            <span class="result-btn confirm-btn" @click="payIt">确定</span>
            <span v-show="getUserConfig.allow_fast_checkout == '1'" class="result-btn quickCash" @click="quickPay">快速结账</span>
        </div>
      </div>
    </div>
</template>

<script>
import commonutil from 'util'
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
import CheckCouponComp from 'components/coupons/CheckCoupon'
export default {
    data() {
        return {
           cashes: '',
           fixedValue: [
               {
                   name: "50元",
                   value: 50
               },
               {
                   name: "100元",
                   value: 100
               },
               {
                   name: "200元",
                   value: 200
               }
           ]
        }
    },

    computed:{
      ...mapGetters([
          'payData',
          'returnPay',
          'payNum',
          'availableCouponList',
          'getUserConfig'
      ]),
      notPayAmount(){
          return this.payData.notPayAmount
      }
    },

    watch: {
        cashes() {
          this.cashes = commonutil.NumberTransform(this.cashes)
          let change =Number(this.cashes) -  Number(this.payData.notPayAmount)
          change = change <= 0 ? 0 : change
          this.SAVE_CHANGE_CASH({cash: this.cashes, change: change})
        },
        notPayAmount(){
            this.cashes = '';
            let change =Number(this.cashes) -  Number(this.payData.notPayAmount)
            change = change <= 0 ? 0 : change
            this.SAVE_CHANGE_CASH({cash: this.cashes, change: change})
        }
    },

    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH
        ]),

        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },
        
        payIt() {
          if(this.cashes || this.payData.notPayAmount == 0) {
             this.$emit('payIt')
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


        quickPay() {
        //   if(Number(this.payData.notPayAmount) > 999.99) return this.$message({
        //                         showClose: true,
        //                         message: "支付金额不得大于999.99元， 请多次支付",
        //                         type: 'warning'
        //                      });
          this.cashes = String(this.payData.notPayAmount)
          this.SAVE_CHANGE_CASH({cash: this.cashes, change: 0})
          this.payIt();
        },

        showResult(value) {
           this.cashes = value;
        },

        selFixedValue(value) {
           this.cashes = String(value)
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

        .realPay {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 12px 0;

            .input-container {
                display: block;
                width: 17.6vw;
                height: 4.2vh;
                border: 1px solid #bcbcbc;
                border-radius: 2px;
                padding: 0 12px;
                margin: 0 4px;

                &:focus {
                    border: 1px solid $btn-background-color-theme;
                }
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

        .action-container {
            margin-top: 8px;
            margin-bottom: 2px;

            .default-btn {
                width: 6.3vw;
                height: 4.2vh;
                border-radius: 2px;
                border: 1px solid $btn-background-color-theme;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: $font-color-blue;
                font-size: $font-size12;
                margin-right: 4px;
                cursor: pointer;

                &:hover {
                    background: $btn-background-color-theme;
                    color: $font-color-white;
                }

                &:first-child{
                    margin-left: 3.6vw;
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


