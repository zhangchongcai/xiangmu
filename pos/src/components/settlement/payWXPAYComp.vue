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
         </div>
         <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">已付款：</span>
                 <span class="count-num total-num">{{payData.payedAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{payData.notPayAmount + "元"}}</span>
             </span>
         </div>

         <div class="realPay">
             <span class="input-container-side">实收:</span>
             <input class="input-container" v-model="realPay" type="text" placeholder="实收数额">
             <span class="input-container-side">元</span>
         </div>
         <div class="realPay">
             <span class="input-container-side">条形码:</span>
             <input class="input-container" ref="qrCode" v-model="barCode" type="text" placeholder="条形码" @change="inputtingCode">
         </div>

         <div class="action-container">
             <span class="input-container-side">提示:</span>
             <span class="input-container-without-line">
                 请使用扫描枪扫描顾客手机上的条码
             </span>
         </div>

         <check-coupon-comp @openCouponCheckoutBox="openCouponCheckoutBox"></check-coupon-comp>
      </div>

      <div class="right">
        <NumberKeyBoard v-model="realPay" :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <span class="result-btn" @click="cancle">取消</span>
        <span class="result-btn confirm-btn" @click="payIt">确定</span>
      </div>
    </div>
</template>

<script>
import commonutil from 'util'
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH, SAVE_CHANGE_CODE} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
import CheckCouponComp from 'components/coupons/CheckCoupon'
export default {
    data() {
        return {
            realPay: '', //实际支付
            barCode: '', //条形码
            online: false,
            outline: true
        }
    },

    computed:{
      ...mapGetters([
          'payData'
      ]),
      notPayAmount(){
        return this.payData.notPayAmount
        }
    },

    watch: {
        realPay() {
          this.realPay = commonutil.NumberTransform(this.realPay)
          let change =Number(this.realPay) -  Number(this.payData.notPayAmount)
          change = change <= 0 ? 0 : change
          this.SAVE_CHANGE_CASH({cash: this.realPay, change: change})
        },
        notPayAmount(value){
            this.realPay = value+''
        }
    },
    mounted(){
        this.realPay = this.payData.notPayAmount+'';
        this.$refs.qrCode.focus()
    },
    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH,
            SAVE_CHANGE_CODE
        ]),

        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },

        inputtingCode() {
            // console.log(this.barCode)
            this.SAVE_CHANGE_CODE(this.barCode)
        },
        
        showResult(value) {
           this.realPay = value;
        },

        payIt() {
          if(this.realPay) {
              if(this.realPay > this.payData.notPayAmount) {
                   this.$message({
                                showClose: true,
                                message: "实收金额不能大于未付金额",
                                type: 'warning'
                             });
              }else {
                 this.$emit('payIt')
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
          this.realPay = ''
          this.barCode = ''
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

        

        .realPay, .action-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 8px 0;

            .input-container {
                display: block;
                width: 15.8vw;
                height: 4.2vh;
                border: 1px solid #bcbcbc;
                border-radius: 2px;
                padding: 0 12px;
                margin: 0 4px;

                &:focus {
                    border: 1px solid $btn-background-color-theme;
                }
            }
            .input-container-without-line {
                display: block;
                width: 15.8vw;
                margin: 0 4px;
            }
            .input-container-side {
                display: flex;
                width: 6.2vw;
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
                border-radius: 2px;
                border: 1px solid $btn-background-color-theme;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: $font-color-blue;
                font-size: $font-size12;
                padding: 1.2vh 2.2vw;
                cursor: pointer;

                &:hover {
                    background: $btn-background-color-theme;
                    color: $font-color-white;
                }

                &:first-child{
                    margin-left: 4.4vw;
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
           margin-right: 0.6vw;
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


