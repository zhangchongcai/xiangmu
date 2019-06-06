<template>
    <div class="pay-containers">
      <div class="left">

          <div style="margin-bottom: 20px;">
             <span>
                 <span class="pay-count">原价：</span>
                 <span class="count-num total-num">{{payData.originalAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">优惠：</span>
                 <span class="count-num total-num">{{payData.couponAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 20px;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{payData.payAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 20px;">
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
             <input class="input-container" v-model="barCode" type="text" placeholder="条形码" @change="inputtingCode">
         </div>

         <div class="action-container">
             <span class="input-container-side">提示:</span>
             <span class="input-container-without-line">
                 请使用扫描枪扫描顾客手机上的条码
             </span>
         </div>
      </div>

      <div class="right">
        <NumberKeyBoard :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <span class="result-btn" @click="cancle">取消</span>
        <span class="result-btn confirm-btn" @click="payIt">确定</span>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH, SAVE_CHANGE_CODE} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
export default {
    data() {
        return {
            realPay: '', //实际支付
            barCode: '', //条形码
        }
    },

    computed:{
      ...mapGetters([
          'payData'
      ])
    },

    watch: {
        realPay() {
          this.realPay = this.NumberCheck(this.realPay)
          let change =Number(this.realPay) -  Number(this.payData.notPayAmount)
          change = change <= 0 ? 0 : change
          this.SAVE_CHANGE_CASH({cash: this.realPay, change: change})
        }
    },

    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH,
            SAVE_CHANGE_CODE
        ]),

         inputtingCode() {
            // console.log(this.barCode)
            this.SAVE_CHANGE_CODE(this.barCode)
        },

        showResult(value) {
           this.realPay = value;
        },

        NumberCheck(num) {
            let str = num;
            let len1 = str.substr(0, 1);
            let len2 = str.substr(1, 1);
            //如果第一位是0，第二位不是点，就用数字把点替换掉
            if (str.length > 1 && len1 == 0 && len2 != ".") {
                str = str.substr(1, 1);
            }
            //第一位不能是.
            if (len1 == ".") {
                str = "";
            }
            //限制只能输入一个小数点
            if (str.indexOf(".") != -1) {
                let str_ = str.substr(str.indexOf(".") + 1);
                if (str_.indexOf(".") != -1) {
                str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
                }
            }
            //正则替换，保留数字和小数点
            str = str.replace(/[^\d^\.]+/g,'')
            //如果需要保留小数点后两位，则用下面公式
            // str = str.replace(/\.\d\d$/,'')
            return str;
        },

        payIt() {
          if(this.realPay) {
             this.$emit('payIt')
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
    },

    components: {
        NumberKeyBoard
    }
}
</script>

<style lang="scss" scoped>
  .pay-containers {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 18px;

    .left {
        width: 34vw;

        

        .realPay, .action-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 20px 0;

            .input-container {
                display: block;
                width: 15.8vw;
                height: 4.9vh;
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


