<template>
    <div class="pay-containers">
      <div class="left">

          <div style="margin-bottom: 6px;">
             <span>
                 <span class="pay-count">原价：</span>
                 <span class="count-num total-num">{{payData.originalAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">优惠：</span>
                 <span class="count-num total-num">{{payData.couponAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 6px;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{payData.payAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 6px;">
             <span>
                 <span class="pay-count">已付款：</span>
                 <span class="count-num total-num">{{payData.payedAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{notPayAmount+ "元"}}</span>
             </span>
         </div>

         <div class="realPay">
             <span class="input-container-side">实收:</span>
             <input class="input-container" :disabled="true" v-model="realPay" type="text" placeholder="实收数额">
             <span class="input-container-side">元</span>
         </div>

         <div class="realPay">
             <span class="input-container-side">{{payMethod.payMode == 1 ? '支付凭证':'条形码'}}</span>
             <input class="input-container" v-model="voucherNum" type="text" :placeholder="  payMethod.payMode == 1 ? '请输入支付凭证':'请输入条形码'">
         </div>
         <!-- <div class="realPay">
             <span class="input-container-side">支付凭证:</span>
             <input class="input-container" v-model="voucherNum" type="text" placeholder="凭证">
         </div> -->

         <!-- <div class="action-container">
             <span class="input-container-side">支付模式:</span>
             <span class="input-container-without-line">
                 <el-checkbox v-model="online">连线支付</el-checkbox>
                 <el-checkbox v-model="outline">离线支付</el-checkbox>
             </span>
         </div> -->

         <check-coupon-comp @openCouponCheckoutBox="openCouponCheckoutBox"></check-coupon-comp>
      </div>

      <div class="right">
        <NumberKeyBoard v-model="realPay" :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <div class="btn-container">
            <span class="result-btn" @click="cancle">取消</span>
            <span class="result-btn confirm-btn" @click="payIt">确定</span>
            <!-- <span class="result-btn quickCash" @click="quickPay">快速结账</span> -->
        </div>
      </div>
    </div>
</template>

<script>
import commonutil from 'util'
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH, GLOBAL_CARD_PAY_SET_BANk_INFO} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
import CheckCouponComp from 'components/coupons/CheckCoupon'
export default {
    data() {
        return {
            realPay: '', //实际支付
            voucherNum: '',
            cardNum: '',
            online: false,
            outline: true
        }
    },

    computed:{
      ...mapGetters([
          'payData',
          'payMethod'
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
            console.log(this.realPay)
            // this.SAVE_CHANGE_CASH({cash: this.realPay, change: 0})
        }
    },
    mounted(){
        this.realPay = this.payData.notPayAmount+'';
    },
    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH,
            GLOBAL_CARD_PAY_SET_BANk_INFO
        ]),

        showResult(value) {
           this.realPay = value;
        },

        //清空上一笔支付金额
        clearOldCash() {
          this.realPay = ''
          this.voucherNum = ''
          this.cardNum = ''
        },

        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox") 
        },

        payIt() {
            // if(!this.voucherNum) return this.$message.warning('请输入支付凭证!')
            // if(!this.cardNum) return this.$message.warning('请输入银行卡号!')
            if(this.realPay) {
                if(this.realPay > this.payData.notPayAmount) {
                   this.$message({
                                showClose: true,
                                message: "实收金额不能大于未付金额",
                                type: 'warning'
                             });
              }else {
                this.GLOBAL_CARD_PAY_SET_BANk_INFO({
                    // delFlag: true,
                    bankCardCode: this.cardNum,
                    returnCode: this.voucherNum
                })
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

        cancle() {
          this.$emit('closePay')
        },

        quickPay() {
          this.realPay = String(this.payData.notPayAmount)
          this.SAVE_CHANGE_CASH({cash: this.realPay, change: 0})
          this.payIt()
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


